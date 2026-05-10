"""
Train Lucida classifier and persist to webapp/backend/models/.

Run once locally:
    python webapp/scripts/train_model.py

Output:
    webapp/backend/models/lucida_rf.pkl       (RandomForest, binary at-risk)
    webapp/backend/models/feature_meta.json   (feature list, training stats)
"""

import json
import joblib
import pandas as pd
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

ROOT = Path(__file__).resolve().parent.parent.parent
DATA = ROOT / "data"
OUT = ROOT / "webapp" / "backend" / "models"
OUT.mkdir(parents=True, exist_ok=True)

print(f"[1/4] Loading data from {DATA}...")
sessions = pd.read_csv(DATA / "typing_sessions.csv")
users = pd.read_csv(DATA / "users.csv")

agg = sessions.groupby("user_id").agg(
    avg_ht=("ht_ms", "mean"),
    std_ht=("ht_ms", "std"),
    avg_ft=("ft_ms", "mean"),
    std_ft=("ft_ms", "std"),
    avg_keys_per_session=("n_keys", "mean"),
).reset_index()

df = agg.merge(users[["user_id", "age", "group"]], on="user_id")
df["at_risk"] = df["group"].isin(["MCI", "AD"]).astype(int)

FEATURES = ["avg_ht", "std_ht", "avg_ft", "std_ft", "avg_keys_per_session", "age"]

# Users with a single session have NaN std (Bessel-corrected on n=1).
# Drop them rather than fillna(0), which would falsely look like perfect
# stability and skew the classifier toward HC.
before = len(df)
df = df.dropna(subset=FEATURES).reset_index(drop=True)
dropped = before - len(df)
if dropped:
    print(f"  - Dropped {dropped} users with NaN features (single-session users).")

X = df[FEATURES].values
y = df["at_risk"].values
assert not pd.isna(X).any(), "NaN in feature matrix after dropna — investigate."

print(f"  - Total users: {len(df)}")
print(f"  - At-risk users: {y.sum()} ({y.mean()*100:.1f}%)")

print("[2/4] Training Random Forest...")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3,
                                          stratify=y, random_state=42)
rf = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
rf.fit(X_tr, y_tr)
auc = roc_auc_score(y_te, rf.predict_proba(X_te)[:, 1])
print(f"  - Test ROC-AUC: {auc:.3f}")

print("[3/4] Saving model...")
joblib.dump(rf, OUT / "lucida_rf.pkl")

# Feature stats for the API to map UI inputs → model features
stats = df[FEATURES].describe().to_dict()
meta = {
    "features": FEATURES,
    "training_auc": round(float(auc), 4),
    "n_users": len(df),
    "feature_stats": {f: {k: float(v) for k, v in stats[f].items()} for f in FEATURES},
    "group_counts": df["group"].value_counts().to_dict(),
    "per_group_means": (
        df.groupby("group")[FEATURES].mean().to_dict()
    ),
}

# Insurance lookup (per-group baseline incidence and intervention effect)
ins = pd.read_csv(DATA / "insurance_simulation.csv")
ins_summary = (
    ins.groupby("group")
    .agg(
        base_5yr=("base_5yr_progression", "mean"),
        adjusted_5yr=("adjusted_5yr_progression", "mean"),
        delay_months=("delay_months", "mean"),
        avg_premium=("monthly_premium", "mean"),
    )
    .to_dict("index")
)
meta["insurance_summary"] = {
    g: {k: float(v) for k, v in row.items()} for g, row in ins_summary.items()
}

with open(OUT / "feature_meta.json", "w") as f:
    json.dump(meta, f, indent=2)

print("[4/4] Done.")
print(f"  - {OUT/'lucida_rf.pkl'}")
print(f"  - {OUT/'feature_meta.json'}")
