"use client";

type Props = {
  redactedLength: number; // how many keystrokes have happened
  htMean: number;
  ftMean: number;
  capturedLabel: string;
  ignoredLabel: string;
  whatLabel: string;
  notLabel: string;
};

/**
 * PrivacyMirror — a live demonstration that we capture only timing.
 *
 * Left column ("Captured")  : timing dots that pulse on every keystroke.
 * Right column ("Ignored")  : the user's actual content shown as opaque
 *                              blocks — never leaves the device, but we
 *                              show that we've literally not read it.
 */
export default function PrivacyMirror({
  redactedLength,
  htMean,
  ftMean,
  capturedLabel,
  ignoredLabel,
  whatLabel,
  notLabel,
}: Props) {
  const N = Math.min(redactedLength, 48);
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Captured */}
      <div
        className="rounded-[10px] p-4"
        style={{
          background: "var(--sage-soft)",
          border: "1px solid var(--rule)",
        }}
      >
        <div
          className="text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--sage)" }}
        >
          {whatLabel}
        </div>
        <div
          className="mt-1 text-[12.5px] font-medium"
          style={{ color: "var(--ink-900)" }}
        >
          {capturedLabel}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {Array.from({ length: N }, (_, i) => (
            <span
              key={i}
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--sage)" }}
              aria-hidden
            />
          ))}
          {redactedLength > N ? (
            <span
              className="text-[10px] tabular self-end"
              style={{ color: "var(--sage)" }}
            >
              +{redactedLength - N}
            </span>
          ) : null}
        </div>
        <dl
          className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px] tabular"
          style={{ color: "var(--ink-700)" }}
        >
          <div className="flex justify-between">
            <dt>HT</dt>
            <dd>{redactedLength > 0 ? htMean.toFixed(0) : "–"} ms</dd>
          </div>
          <div className="flex justify-between">
            <dt>FT</dt>
            <dd>{redactedLength > 1 ? ftMean.toFixed(0) : "–"} ms</dd>
          </div>
        </dl>
      </div>

      {/* Ignored */}
      <div
        className="rounded-[10px] p-4"
        style={{
          background: "var(--paper-3)",
          border: "1px solid var(--rule)",
        }}
      >
        <div
          className="text-[10.5px] uppercase tracking-[0.14em]"
          style={{ color: "var(--ink-500)" }}
        >
          {notLabel}
        </div>
        <div
          className="mt-1 text-[12.5px] font-medium"
          style={{ color: "var(--ink-900)" }}
        >
          {ignoredLabel}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {Array.from({ length: N }, (_, i) => (
            <span
              key={i}
              className="inline-block h-2.5 rounded-sm"
              style={{
                width: `${4 + (i % 3) * 2}px`,
                background: "var(--ink-300)",
                opacity: 0.55,
              }}
              aria-hidden
            />
          ))}
        </div>
        <p
          className="mt-3 text-[10.5px] leading-[1.5]"
          style={{ color: "var(--ink-500)" }}
        >
          ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒ ▒
        </p>
      </div>
    </div>
  );
}
