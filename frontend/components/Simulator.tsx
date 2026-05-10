"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  simulate,
  type SimulateRequest,
  type SimulateResponse,
} from "@/lib/api";
import { levelLabel } from "@/lib/labels";
import Eyebrow from "./ui/Eyebrow";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useLang } from "./LanguageContext";
import Results from "./Results";

type SimState = "idle" | "loading" | "success" | "error";

type FormState = SimulateRequest;

const INITIAL: FormState = {
  age: 60,
  sex: "F",
  typing_speed: 60,
  latency_variance: 35,
};

type FieldRowProps = {
  label: string;
  value: ReactNode;
  valueLabel?: string;
  help: string;
  children: ReactNode;
};

function FieldRow({
  label,
  value,
  valueLabel,
  help,
  children,
}: FieldRowProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label
          className="text-[13px] font-medium"
          style={{ color: "var(--ink-900)" }}
        >
          {label}
        </label>
        <div
          className="text-[13px] tabular"
          style={{ color: "var(--ink-700)" }}
        >
          <span className="font-medium">{value}</span>
          {valueLabel ? (
            <span className="ml-2" style={{ color: "var(--ink-400)" }}>
              {valueLabel}
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-3">{children}</div>
      <p
        className="mt-2 text-[12px] leading-[1.5]"
        style={{ color: "var(--ink-400)" }}
      >
        {help}
      </p>
    </div>
  );
}

export default function Simulator() {
  const { t, lang } = useLang();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [state, setState] = useState<SimState>("idle");
  const [result, setResult] = useState<SimulateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (req: SimulateRequest) => {
      setState("loading");
      setError(null);
      try {
        const r = await simulate(req);
        setResult(r);
        setState("success");
      } catch (_e) {
        setError(t.sim.errorGeneric);
        setState("error");
      }
    },
    [t]
  );

  // Preset listener
  useEffect(() => {
    function onPreset(e: Event) {
      const detail = (e as CustomEvent<SimulateRequest>).detail;
      const next: FormState = {
        age: detail.age,
        sex: detail.sex,
        typing_speed: detail.typing_speed,
        latency_variance: detail.latency_variance,
      };
      setForm(next);
      void run(next);
    }
    window.addEventListener("lucida:preset", onPreset);
    return () => window.removeEventListener("lucida:preset", onPreset);
  }, [run]);

  const speedLevel = levelLabel(t, "speed", form.typing_speed);
  const varianceLevel = levelLabel(t, "variance", form.latency_variance);

  function setField<K extends keyof FormState>(
    key: K,
    val: FormState[K]
  ) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function reset() {
    setForm(INITIAL);
    setResult(null);
    setState("idle");
    setError(null);
  }

  return (
    <section
      id="simulator"
      className="rule-t"
      style={{ background: "var(--paper-2)" }}
    >
      <div className="max-w-deck mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <header className="max-w-2xl">
          <Eyebrow>{t.sim.eyebrow}</Eyebrow>
          <h2
            className="mt-4 font-serif text-[34px] lg:text-[40px] leading-[1.1]"
            style={{ color: "var(--ink-900)" }}
          >
            {t.sim.title}
          </h2>
        </header>

        <div className="mt-10 grid lg:grid-cols-12 gap-6">
          {/* Form */}
          <Card className="lg:col-span-5 p-7 lg:p-8">
            <div className="flex items-center justify-between">
              <Eyebrow tone="ink">{t.sim.formTitle}</Eyebrow>
              <span
                className="text-[11px] tabular"
                style={{ color: "var(--ink-300)" }}
              >
                4 inputs
              </span>
            </div>

            <div className="mt-6 space-y-7">
              <FieldRow
                label={t.sim.field.age}
                value={`${form.age} ${lang === "ko" ? "세" : "yr"}`}
                help={t.sim.field.ageHelp}
              >
                <input
                  type="range"
                  className="lc-range"
                  min={30}
                  max={85}
                  step={1}
                  value={form.age}
                  aria-valuetext={`${form.age}`}
                  onChange={(e) =>
                    setField("age", parseInt(e.target.value, 10))
                  }
                />
                <div className="lc-ticks">
                  <span>30</span>
                  <span>50</span>
                  <span>70</span>
                  <span>85</span>
                </div>
              </FieldRow>

              <FieldRow
                label={t.sim.field.sex}
                value={t.sim.sex[form.sex]}
                help={t.sim.field.sexHelp}
              >
                <div
                  className="lc-seg"
                  role="group"
                  aria-label={t.sim.field.sex}
                >
                  <button
                    type="button"
                    aria-pressed={form.sex === "F"}
                    onClick={() => setField("sex", "F")}
                  >
                    {t.sim.sex.F}
                  </button>
                  <button
                    type="button"
                    aria-pressed={form.sex === "M"}
                    onClick={() => setField("sex", "M")}
                  >
                    {t.sim.sex.M}
                  </button>
                </div>
              </FieldRow>

              <FieldRow
                label={t.sim.field.speed}
                value={form.typing_speed}
                valueLabel={speedLevel}
                help={t.sim.field.speedHelp}
              >
                <input
                  type="range"
                  className="lc-range"
                  min={0}
                  max={100}
                  step={1}
                  value={form.typing_speed}
                  aria-valuetext={`${form.typing_speed} — ${speedLevel}`}
                  onChange={(e) =>
                    setField("typing_speed", parseInt(e.target.value, 10))
                  }
                />
                <div className="lc-ticks">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </FieldRow>

              <FieldRow
                label={t.sim.field.variance}
                value={form.latency_variance}
                valueLabel={varianceLevel}
                help={t.sim.field.varianceHelp}
              >
                <input
                  type="range"
                  className="lc-range"
                  min={0}
                  max={100}
                  step={1}
                  value={form.latency_variance}
                  aria-valuetext={`${form.latency_variance} — ${varianceLevel}`}
                  onChange={(e) =>
                    setField(
                      "latency_variance",
                      parseInt(e.target.value, 10)
                    )
                  }
                />
                <div className="lc-ticks">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </FieldRow>
            </div>

            {state === "error" && error ? (
              <div
                role="alert"
                className="mt-6 px-4 py-3 rounded-[8px] text-[13px]"
                style={{
                  background: "var(--burgundy-soft)",
                  color: "var(--burgundy)",
                  border: "1px solid var(--burgundy-soft)",
                }}
              >
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex items-center gap-3">
              <Button
                onClick={() => run(form)}
                disabled={state === "loading"}
              >
                {state === "loading" ? t.sim.btn.running : t.sim.btn.run}
              </Button>
              <Button variant="ghost" onClick={reset}>
                {t.sim.btn.reset}
              </Button>
            </div>
          </Card>

          {/* Result */}
          <div className="lg:col-span-7">
            <Results state={state} result={result} />
          </div>
        </div>
      </div>
    </section>
  );
}
