# Lucida Risk Simulator — Webapp

Interactive web app for the Lucida preventive dynamic underwriting concept.
Deployed at **https://lucida.hbinserver.cloud**.

- **Frontend** — Next.js 14 (App Router) + Tailwind, served by `node server.js`
- **Backend** — FastAPI + scikit-learn RandomForest (loaded from pickle)
- **Reverse proxy** — host nginx + certbot (Let's Encrypt SSL)

---

## Local development

```bash
# 1) Train and persist the model (one-time, run from repo root)
python webapp/scripts/train_model.py
# → webapp/backend/models/lucida_rf.pkl
# → webapp/backend/models/feature_meta.json

# 2) Backend (in one terminal)
cd webapp/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3) Frontend (in another terminal)
cd webapp/frontend
npm install
npm run dev   # http://localhost:3000

# Frontend talks to /api/* — for local dev, the same-origin proxy is the
# nginx box. To talk directly to backend in dev, set:
#   NEXT_PUBLIC_API_BASE=http://localhost:8000/api
```

---

## Production deploy (Ubuntu + Docker + nginx + certbot)

### 0. Prerequisites
- DNS A record pointing `lucida.hbinserver.cloud` → server's public IP
- Ubuntu 22.04+ with `docker`, `docker compose`, `nginx`, `certbot` installed:
  ```bash
  sudo apt update
  sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
  sudo systemctl enable --now docker nginx
  ```
- Repo cloned to server, e.g. `/opt/risk_cont/`
- The `webapp/backend/models/` folder must contain `lucida_rf.pkl` and
  `feature_meta.json` — these are committed in this repo, but if you ever
  need to retrain, run `python webapp/scripts/train_model.py` locally and
  push.

### 1. Build and start the containers
```bash
cd /opt/risk_cont/webapp
sudo docker compose build
sudo docker compose up -d
sudo docker compose ps
# expect both lucida-backend and lucida-frontend in 'Up' state
```

Quick health check:
```bash
curl http://127.0.0.1:8000/api/health
curl http://127.0.0.1:3000 | head -n 5
```

### 2. nginx site
```bash
sudo cp nginx/lucida.conf /etc/nginx/sites-available/lucida.conf
sudo ln -s /etc/nginx/sites-available/lucida.conf /etc/nginx/sites-enabled/lucida.conf
sudo nginx -t && sudo systemctl reload nginx
```

### 3. SSL with certbot
```bash
sudo certbot --nginx -d lucida.hbinserver.cloud
# certbot will auto-rewrite lucida.conf to add the :443 SSL block.
# Auto-renewal is installed via the certbot-renew systemd timer.
```

### 4. Visit
https://lucida.hbinserver.cloud

---

## Update workflow

```bash
# Local: commit and push
git add .
git commit -m "..."
git push

# Server: pull and rebuild
ssh ubuntu@hbinserver.cloud
cd /opt/risk_cont
git pull
cd webapp
sudo docker compose build
sudo docker compose up -d
```

If only frontend changed:  `sudo docker compose up -d --build frontend`
If only backend changed:   `sudo docker compose up -d --build backend`

---

## Folder structure

```
webapp/
├── backend/
│   ├── app/
│   │   ├── inference.py     # UI inputs → model features → pathway
│   │   └── schemas.py       # Pydantic request/response models
│   ├── models/              # lucida_rf.pkl + feature_meta.json (committed)
│   ├── main.py              # FastAPI entrypoint
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── app/                 # Next.js App Router (layout, page, globals)
│   ├── components/          # Hero, Simulator, Results, HowItWorks, Footer
│   ├── lib/api.ts           # typed client for /api/simulate
│   ├── tailwind.config.ts   # Lucida design tokens
│   └── Dockerfile
├── nginx/
│   └── lucida.conf          # host nginx config (copy to /etc/nginx/sites-available/)
├── scripts/
│   └── train_model.py       # one-time model training
├── docker-compose.yml
└── README.md
```

---

## API

### `GET /api/health`
```json
{ "status": "ok", "model_loaded": true, "model_auc": 1.0 }
```

### `POST /api/simulate`
**Request**
```json
{
  "age": 60,
  "sex": "F",
  "typing_speed": 50,
  "latency_variance": 50
}
```
**Response (abridged)**
```json
{
  "cognitive_score": 67,
  "pathway": "B",
  "pathway_label": "Path B — Early decline (SCD / MCI signal)",
  "monthly_premium_krw": 65000,
  "premium_change_pct": 0.0,
  "five_year_outlook": {
    "without_intervention": 0.15,
    "with_intervention": 0.105,
    "delay_months": 18.0
  },
  "confidence": "medium",
  "derived_features": { "avg_ft": 1000.0, "std_ft": 215.0, "...": "..." },
  "disclaimer": "..."
}
```

---

## Model & data integrity

- The classifier is a Random Forest (`n_estimators=100`, `max_depth=8`) trained
  on synthetic data calibrated to four published cohorts (Park 2024, Keijzer
  2024, Ntracha 2020, Moon 2025; combined `n = 351`).
- The simulator reports a **single-feature flight-time AUC of 0.957** on
  synthetic test data — within the margin of Park (2024)'s real-data AUC of
  0.997. A multivariate AUC of 1.000 is reproducible on this synthetic set
  but is intentionally **not** displayed in the simulator UI; it lives in the
  appendix of the executive deck.
- This product is **not** a medical or insurance instrument. Every response
  carries a disclaimer.
