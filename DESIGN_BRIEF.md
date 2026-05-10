# Lucida Risk Simulator — Design Brief & Engineering Spec

> **Audience of this document:** A Claude designer/coder session that will
> rebuild the visual layer of `webapp/frontend/`. Everything below is
> authoritative: brand context, technical constraints, API contracts,
> bilingual content, accessibility floors, and acceptance criteria.
>
> **Your task:** Read this entire document first. Propose a design direction
> in 1–2 paragraphs (concept, type pairing, color story, motion philosophy)
> and wait for explicit approval. Then ship a complete redesign as one
> coherent set of file changes — no half-applied themes, no orphaned
> components, no untested states.

---

## 0. Project context

**Lucida** is the free-form deliverable for the *4th National Risk Management
Competition* (Samsung Fire × POSTECH × SNU, submission **2026-05-15**, finals
GAIP Singapore Aug 2026). The PPT executive summary is already locked. This
web app is what judges will visit and click after reading the deck.

**The product (one paragraph):** Long-term care insurance is structurally
adversely selected — by the time dementia risk is visible, the customer can
no longer be underwritten. Lucida reads keystroke timing (hold time, flight
time, variability) passively from a phone the user already owns, runs a
classifier calibrated to four published clinical studies, and produces a
cognitive health score that maps to one of three risk pathways with
matching dynamic premiums.

**The web app's job:** in 90 seconds, let a judge feel the product. Not
explain it. Feel it. They move four sliders, they see a score, a pathway,
a 5-year outlook, a premium. They leave understanding why static
underwriting fails and what "preventive intervention" actually looks like.

**Domain:** https://lucida.hbinserver.cloud

---

## 1. Audience & success criteria

### Audience (in priority order)

1. **Korean insurance executives** (Samsung Fire judges) — domain experts,
   conservative aesthetic, expect quantitative rigor.
2. **Korean academic judges** (POSTECH/SNU) — care about methodology
   honesty (synthetic-data framing) and statistical claims.
3. **International finalists** (Singapore GAIP, English-speaking) — first
   impression is the English version.

### Success looks like

- A judge opens the page and within 5 seconds knows what Lucida does.
- Within 30 seconds they have run the simulator at least once.
- They notice the 5-year outlook reduction (Path B) and the explicit
  "we don't capture text" claim.
- They never have to question whether this is medical advice — the
  disclaimer is present but never blocking.

### Anti-success

- Looks like a generic SaaS landing page.
- Looks like a "tech demo" — sterile, gray, every box is the same gray box.
- Hides the science (the AUC reference, the cohort sources).
- Buries the privacy claim.

---

## 2. Technical environment (locked — do not change)

### Stack

```
Frontend  : Next.js 14.2 (App Router) + React 18 + TypeScript strict
Styling   : Tailwind CSS 3.4 (no UI library beyond Tailwind primitives)
Backend   : FastAPI 0.115 + scikit-learn 1.8 (RandomForest pickle)
Container : Docker (frontend = standalone Next, backend = uvicorn)
Reverse proxy : nginx + certbot on the host (Ubuntu)
Build deploy  : git push → server git pull → docker compose up
```

### What you can change

- Everything inside `webapp/frontend/components/` (layout, visuals, motion).
- `webapp/frontend/app/globals.css` (CSS variables, base styles).
- `webapp/frontend/tailwind.config.ts` (design tokens).
- `webapp/frontend/app/layout.tsx` and `app/page.tsx` (composition).

### What you must not change

- `webapp/frontend/lib/i18n.ts` — translation strings are reviewed
  copy. You can ADD new keys, never remove or alter existing English.
- `webapp/frontend/lib/api.ts` — API client typing.
- `webapp/backend/**` — backend is locked.
- `webapp/docker-compose.yml`, `webapp/nginx/lucida.conf` — deploy
  surface is fixed.
- The route shape — single page at `/`, no client routing yet.

### What you may add

- New UI primitives in `components/ui/` (Card, Tag, Stat, etc.).
- A motion utility module if needed (Framer Motion is acceptable; otherwise
  CSS keyframes via Tailwind).
- New Tailwind plugins ONLY if they replace an inline workaround.

### Browser support floor

- Latest 2 versions of Chrome, Safari (incl. iOS), Firefox, Edge.
- Android Chrome on viewports ≥ 360 px wide.

---

## 3. Information architecture (sections)

The page is a single vertical scroll, top to bottom:

```
 1. Hero            — what is Lucida + 4 KPI numbers + 2 CTAs
 2. UsageGuide      — how to use this simulator + 3 preset chips + 3 steps
 3. Simulator       — the form (left) and the result card (right)
 4. HowItWorks      — 4-step pipeline + privacy callout
 5. Footer          — team, competition, disclaimer
```

A floating language toggle (`EN | 한국어`) is fixed top-right, always
visible. The toggle persists choice in `localStorage` under
`lucida-lang`.

### Section purposes

| Section | One-line purpose | Critical content |
|---|---|---|
| Hero | Frame the problem, get to the simulator | Tagline, 4 KPI stats (Super-aged / 1M+ / ₩24T / 7–10 yr), "Try the simulator" CTA |
| UsageGuide | Make the simulator legible to a non-technical judge in 10 s | 3 preset cards (Healthy / Borderline / At-risk), 3 micro-steps |
| Simulator | The hands-on interaction | 4 inputs (age, sex, typing speed, latency variance), Run / Reset, Result panel |
| HowItWorks | Show the science without overwhelming | 4 numbered steps (Capture → Extract → Classify → Re-price), privacy box |
| Footer | Authorship, attribution, disclaimer | Team JEONNAM NICE, Sunchon National University, members, competition info, full disclaimer |

---

## 4. Brand essence

| Pole | Lucida is | Lucida is NOT |
|---|---|---|
| Tone | Quietly confident. Editorial. | Hype-y, exclamation-mark-y. |
| Color | Calm, slightly cool. One quiet hero color. | Rainbow, neon, gradient mesh. |
| Typography | Readable, tabular, restrained. Inter is fine. | Display fonts that scream brand. |
| Density | Spacious where it counts (Hero, Result), dense where data lives (the per-feature breakdown). | Uniformly sparse OR uniformly dense. |
| Motion | Restrained. Things move because something happened. | Decorative parallax, hero blobs, scroll-jacking. |
| Imagery | Type, numbers, clean charts. Possibly one diagram. | Stock photos of elderly couples on the beach. |

If the design feels like a Stripe/Linear/Anthropic landing page that happens
to be about insurance, you're warm.
If it feels like an insurance company's website, you're cold.

---

## 5. Design tokens — current values (replace at will)

These tokens are the floor. You may rename them, restructure them, swap
the hero color, shift the type scale. The constraint is *coherent system*
— if you replace `lucida-blue`, replace it consistently across all states.

### Current colors (`tailwind.config.ts`)

```
lucida-blue   #2E86AB   primary / hero CTA / score bar
lucida-green  #1B7F62   Path A (healthy), positive intervention
lucida-amber  #F4A261   Path B (early decline)
lucida-red    #9B2226   Path C (established decline), errors
ink-900       #111827   body text
ink-500       #6B7280   secondary text
ink-300       #9CA3AF   muted / footer
surface       #FFFFFF   canvas
surface-muted #F9FAFB   alternate band background
surface-insight #EFF6FF callout backgrounds
surface-divider #E5E7EB hairlines
```

If you keep these, fine. If you want a different feel (e.g., a deeper
indigo as primary, an editorial cream as canvas), propose it in your
opening paragraph.

### Typography (current)

- **Inter** loaded from `https://rsms.me/inter/inter.css`.
- One family. Three weights: 400, 500/600, 600/700.
- Tabular numbers via `font-feature-settings: "cv11", "ss01"` (already in
  `globals.css`).

You may add **one** display family for headlines if it earns its place
(e.g., a serif like Source Serif 4, GT Sectra, or a geometric like
Inter Display). The numerical/tabular surface must remain Inter.

### Spacing & radius

- 8 pt rhythm. Tailwind defaults are fine.
- Cards: `12 px` radius is the current value; you can move to 8 or 16
  depending on density of the overall composition.

### Shadow

Two shadow scales max. Today there's `shadow-card` and `shadow-focus`.
Don't add five.

### Motion

- Defaults: 150–200 ms ease-out for hover/press, 240–320 ms ease-in-out
  for state transitions.
- Avoid: bounces, springs > 400 ms, anything >500 ms on scroll.
- Respect `prefers-reduced-motion`.

---

## 6. Component-by-component spec

### 6.1 LanguageToggle  *(fixed top-right)*

- Pill containing two segments: `EN`, `한국어`.
- Active state: filled, white text on primary.
- Inactive: ghost, neutral-500 text.
- Always reachable: `position: fixed; top: 1rem; right: 1rem; z-50`.
- Accessible name from `t.lang.switchTo`.
- On scroll, adopt a subtle backdrop-blur so the pill stays legible over
  any band.

### 6.2 Hero

**Content (in order)**
1. Eyebrow (small, primary color, uppercase tracking)
2. Headline H1 (two lines via `<br>` on `sm:` and up)
3. Body paragraph (max-w-2xl, ink-500)
4. Two CTAs side-by-side: primary (Try the simulator → `#how-to-use`),
   ghost (How it works → `#how-it-works`)
5. KPI strip — 4 stats in a 2×2 (mobile) or 1×4 (desktop) grid

**Visual hooks**
- The two-line headline should breathe. Don't cram it.
- KPI numbers are the brand voice — set them tabular-nums, large weight,
  and let them do the work.
- Avoid a hero illustration. If you must add a visual, it can be a
  *single* wireframe-line cognitive-decline curve at the right edge —
  but optional, and never decorative.

### 6.3 UsageGuide  *(currently between Hero and Simulator)*

**Content**
1. Eyebrow + section title + 1-line body.
2. Three preset cards (Healthy 45 / Borderline 60 / At-risk 70). Each
   card carries: a bold label, a 5-word descriptor, and the four input
   values that will be loaded.
3. Three step cards beneath (Set inputs → Run → Read result).

**Behavior**
- Clicking a preset dispatches a `CustomEvent('lucida:preset')` on
  `window` with `detail: SimulateRequest`. The Simulator listens and
  auto-runs.
- Smoothly scrolls to `#simulator`.
- The Healthy preset uses green accents, Borderline uses amber, At-risk
  uses red — color tags the card so the user understands the spectrum.

**Visual hooks**
- The three preset cards should look like buttons, not info cards. Tap
  affordance is the message.

### 6.4 Simulator

**Layout**
- Two columns at `lg:` breakpoint. Stack on mobile.
- Left: form card. Right: results card.

**Form**
- Age — range slider 30–85, current value displayed inline (`60 yr`).
- Sex — segmented control, two buttons (Female / Male).
- Typing speed — range slider 0–100. Show numeric value plus localized
  level label (Slow / Below average / Above average / Fast).
- Latency variance — same shape as typing speed (Very stable / Moderate
  / Inconsistent / Erratic).
- Helper text under each input explains what the input maps to in the
  model (one short sentence).
- Submit button (primary, full text label changes between
  "Run simulation" and "Simulating…").
- Reset button (ghost). Resets form *and* clears the result.

**Result card states**
- *Empty (initial)* — placeholder explains how to start.
- *Loading* — spinner + label "Running classifier…"
- *Success* — see 6.5.
- *Error* — inline alert *inside the form* (not the result card), with
  the API error message. Accessible via `role="alert"`.

### 6.5 Results card  *(rendered inside Simulator's right column)*

The single most important component. This is where the product lives.

**Sections (in order)**
1. **Score block** — large numeric score (0–100) with a subtle progress
   bar beneath it; pathway tag (`Path A/B/C`) on the right, color-coded.
   Confidence label below the bar.
2. **Pathway block** — colored left-border callout with the pathway's
   localized label and description.
3. **Two-up** — Monthly premium (₩) and AD-onset delay (mo).
4. **5-year outlook** — two horizontal bar comparisons:
   "Without intervention" (red) vs "With Lucida intervention" (green),
   plus a one-line summary of the absolute pp reduction and the relative
   percentage if `reduction > 0.05`.
5. **Derived inputs** — collapsible `<details>` listing the six raw
   model features (avg_ht, std_ht, avg_ft, std_ft, avg_keys_per_session,
   age) with their numeric values. Monospace tabular.
6. **Disclaimer** — italic, small, at the bottom.

**Visual hooks**
- The score number must be *the* visual anchor of the page when present.
  6xl, semibold, tabular-nums.
- The two outlook bars are a quick visual story — without/with
  intervention. Don't make them look like generic loading bars.
- The collapsible derived-features section reassures technical judges
  without overwhelming non-technical ones.

### 6.6 HowItWorks

- Eyebrow, section title, four numbered cards in a single row at `lg:`
  (2-up at `sm:`, 1-up on mobile).
- Each card: step number ("01"–"04"), step title, one-paragraph body.
- Privacy callout below the four cards: a green-bordered card titled
  "Privacy by design" with a paragraph emphasizing what is NOT captured.

### 6.7 Footer

- Four-column grid at `lg:`: tagline (spans 2 cols), Team, Submission.
- Tagline column: brand mark + the closing-line tagline.
- Team column: "Team JEONNAM NICE", school, members.
- Submission column: competition, host institutions, date.
- Bottom line above a hairline divider: full attribution disclaimer.

---

## 7. API contract  *(locked — do not invent new fields)*

### 7.1 GET `/api/health`

Response:
```json
{ "status": "ok", "model_loaded": true, "model_auc": 1.0 }
```

Used only for ops; the UI does not need to render this. You may add a
silent ping on first load to display a "model live" dot in the footer
if you want — optional.

### 7.2 POST `/api/simulate`

**Request**
```ts
{
  age: number,                 // 30..85, integer
  sex: "M" | "F",
  typing_speed: number,        // 0..100, float ok
  latency_variance: number     // 0..100, float ok
}
```

**Response**
```ts
{
  cognitive_score: number,           // 0..100, integer
  pathway: "A" | "B" | "C",
  pathway_label: string,             // English — DO NOT render directly when lang=ko
  pathway_description: string,       // English — same caveat
  monthly_premium_krw: number,       // integer KRW
  premium_change_pct: number,        // -10 | 0 | 30 today
  five_year_outlook: {
    without_intervention: number,    // 0..1
    with_intervention: number,       // 0..1
    delay_months: number             // 0..24
  },
  confidence: "low" | "medium" | "high",
  derived_features: {
    avg_ht: number, std_ht: number,
    avg_ft: number, std_ft: number,
    avg_keys_per_session: number,
    age: number
  },
  disclaimer: string                 // English — see caveat
}
```

**Important — bilingual handling**
The backend always returns English `pathway_label`, `pathway_description`,
and `disclaimer`. When `lang === "ko"`, the frontend MUST substitute
these from `i18n.ts → translations.ko.res.pathway[code]` and
`translations.ko.res.disclaimer`. Use the `pathway` enum (`"A"|"B"|"C"`)
as the key. Never display the backend's English when Korean is selected.

**Errors**
- 422: validation. Surface `detail[].msg` in the form's inline alert.
- 5xx / network: show a generic "Couldn't reach the model. Please retry."
  message localized.

### 7.3 Network UX

- Optimistic state allowed: `setLoading(true)` immediately on submit.
- Debounce slider changes — do NOT call the API on every slider movement;
  the user must click "Run simulation".
- On preset click, run automatically once.

---

## 8. State machine for Simulator + Result

```
                ┌──────────────┐
                │   IDLE       │ ← initial mount
                │ form: empty  │   Result: placeholder
                │ result: null │
                └──────┬───────┘
                       │ user submits or preset fires
                       ▼
                ┌──────────────┐
                │  LOADING     │   Result: spinner
                └──────┬───────┘
              ┌────────┴────────┐
              ▼                 ▼
       ┌──────────┐       ┌──────────┐
       │ SUCCESS  │       │  ERROR   │   inline alert in form
       │ result:  │       │ result:  │   user can edit & retry
       │ filled   │       │ stale or │
       └────┬─────┘       │ null     │
            │ user clicks Reset
            ▼
       (back to IDLE)
```

A new submit always cancels any in-flight request UI (set loading=true,
then the new response wins). Optional: AbortController on the fetch.

---

## 9. Bilingual (i18n)

### Architecture

- `lib/i18n.ts` exports `translations: Record<Lang, Dict>` and the `Dict`
  type. Adding a new key means: add to BOTH `en` and `ko`. TypeScript
  will fail the build if you forget.
- `components/LanguageContext.tsx` provides `useLang()` returning
  `{ lang, setLang, t }`. Every text-rendering component consumes `t`.
- `components/LanguageToggle.tsx` flips `lang` and writes to
  `localStorage`.

### Hard rules

- The site renders **English by default** on first load (SSR + initial
  hydration). The Korean preference applies only after `useEffect` reads
  localStorage. This is the contractual default — don't try to detect
  browser language and switch automatically.
- Numbers, units, and identifiers (`AUC 0.957`, `n=111`, `MoCA-K`) stay
  in their original form in both languages. Don't translate "AUC" to
  "곡선면적" — the audience is bilingual on jargon.
- Do not mix scripts inside one phrase except for proper nouns. Korean
  body must be Korean. English body must be English.

### Where Korean tone differs from English

The Korean copy in `i18n.ts` is calibrated to the audience (Korean
insurance domain, formal but not stiff). Do not "soften" or "modernize"
it — it has been reviewed.

---

## 10. Responsive system

### Breakpoints (Tailwind defaults; use them)

- Mobile-first. Default styles target 360 px.
- `sm: 640px` — tablet portrait.
- `md: 768px` — tablet landscape.
- `lg: 1024px` — desktop. Two-column simulator activates here.
- `xl: 1280px` — comfortable desktop. Hero KPIs go to 4-up.
- `2xl: 1536px` — leave generous side gutters; do not stretch type lines
  past 75 ch.

### Critical responsive moves

- Hero headline: stacks into 2 lines on `sm+` only (the `<br className="hidden sm:block">` already does this).
- KPI strip: 2×2 on mobile, 1×4 on `sm+`.
- Preset cards: 1-up on mobile, 3-up on `sm+`.
- Simulator: stacked on mobile, 2-up at `lg+`.
- Language toggle: stays fixed; do not move it inline on mobile (judges
  on a phone need it equally).

### Touch targets

- All interactive elements ≥ 44 × 44 CSS pixels.
- Sliders: thumbs ≥ 20 px diameter with comfortable padding.
- Segmented sex buttons: ≥ 44 px tall.

---

## 11. Accessibility floor (non-negotiable)

- WCAG **AA** contrast on every text-bg pair. Audit it; don't assume.
- Every interactive control has a visible focus ring (`shadow-focus` in
  current globals).
- All form fields have associated `<label>` elements (already the case).
- Error messages use `role="alert"`.
- Slider value text updates on change and is read by AT.
- Preset cards are real `<button>` elements with `type="button"`.
- The `<details>` derived-features uses native semantics; do not replace
  with a custom toggle that loses keyboard support.
- Language toggle uses `role="group"` with `aria-label`, and each button
  has `aria-pressed`.

---

## 12. Performance budget

- Lighthouse Performance ≥ 90 on a desktop run, ≥ 80 on mobile.
- LCP < 2.5 s on a fast 3G profile (the page is small; this should be
  trivial).
- Total JS payload (First Load) ≤ 120 kB gzipped.
- No third-party scripts (no analytics, no fonts beyond the Inter CDN
  CSS, no GTM).
- Images: there are essentially none. If you add an SVG, inline it
  rather than fetching.

---

## 13. Motion

- Page mount: subtle (≤ 200 ms) fade or rise on Hero only. Sub-sections
  do not animate on scroll.
- Result card mount: ≤ 240 ms ease-out reveal of the score block, then
  the rest fades in 60 ms staggered. Total ≤ 400 ms.
- Slider thumb hover: scale 1.08 (current).
- Toggle pill switch: 150 ms ease-out background slide between segments.
- Avoid: parallax, scroll-driven hero animations, hover effects on
  non-interactive elements.
- Respect `prefers-reduced-motion: reduce` — disable all non-essential
  motion via a media query in `globals.css`.

---

## 14. Anti-patterns (forbidden)

| Forbidden | Why |
|---|---|
| Emoji icons (🧠 🚀 ✅) for structural use | Unprofessional in this domain. Use SVGs (Lucide or Heroicons inline). |
| Gradient hero backgrounds with mesh blobs | Generic SaaS aesthetic. Lucida is editorial. |
| Tooltips that require hover (no mobile path) | Use inline helper text instead. |
| Raw hex values in JSX (`style={{color:"#2E86AB"}}`) | Use Tailwind classes from the design tokens. |
| Animating things on scroll | Distracting; competition demo gets watched on a projector. |
| Putting AUC 1.000 anywhere | This is a calibration artifact, not a claim. The headline metric is 0.957 (FT-only). |
| Rendering English `pathway_label` when `lang === "ko"` | See §7.2 — substitute from i18n. |
| Pop-up modals or cookie banners | None of these exist on Lucida. |
| Auto-switching language by browser locale | English is the default by contract. |

---

## 15. Reference inspirations (taste, not copy)

- **Linear.app** — calm hero, restrained motion, editorial type rhythm.
- **Stripe.com/atlas** — confident product copy, big numbers as visual
  anchors.
- **Anthropic.com** — quiet authority, monochrome with a single accent.
- **Are.na/blog** — editorial type pairing, generous line-height.
- **Bloomberg Beta thesis pages** — large pull-quotes used as section
  separators.

You do **not** need to reproduce any of these. They are tone references.

---

## 16. Bilingual content table (use this; don't write your own copy)

The full bilingual content lives in `webapp/frontend/lib/i18n.ts`. Read
it once. The keys you'll most often touch:

- `hero.titleLine1`, `hero.titleLine2`, `hero.body`, `hero.kpi.*`
- `guide.title`, `guide.body`, `guide.presets.*`, `guide.steps.*`
- `sim.field.*`, `sim.btn.*`, `sim.level.*`
- `res.pathway.A/B/C.{label,description}`, `res.disclaimer`,
  `res.outlookReduction`, `res.outlookReductionTail`
- `how.step.s1..s4.{h,p}`, `how.privacyTitle`, `how.privacyBody`
- `footer.*`

Do **not** invent new copy outside i18n. If you genuinely need new copy,
add it to both EN and KO (translation will be re-reviewed).

---

## 17. File-level deliverable

You will produce changes in exactly these locations:

```
webapp/frontend/
├── app/
│   ├── globals.css        # base styles, CSS variables, motion defaults
│   ├── layout.tsx         # provider wiring (rarely changes)
│   └── page.tsx           # composition order
├── components/
│   ├── Hero.tsx
│   ├── UsageGuide.tsx
│   ├── Simulator.tsx
│   ├── Results.tsx
│   ├── HowItWorks.tsx
│   ├── Footer.tsx
│   ├── LanguageToggle.tsx
│   ├── LanguageContext.tsx       # rarely changes
│   └── ui/                       # NEW — primitives if needed (Card, Stat, Tag)
└── tailwind.config.ts             # token redefinition
```

Do **not** edit:

```
webapp/frontend/lib/i18n.ts       # source of truth for copy
webapp/frontend/lib/api.ts        # API typing — locked
webapp/backend/**                 # backend locked
webapp/docker-compose.yml         # deploy locked
webapp/nginx/lucida.conf          # deploy locked
```

Add only if it pulls weight:
- `components/ui/*.tsx` — small primitives reused in 2+ places.
- `lib/motion.ts` — shared motion presets (only if Framer Motion is
  introduced).

---

## 18. Acceptance criteria (run this checklist before declaring done)

### Build

- [ ] `npx next build` succeeds with **zero** TypeScript errors and zero
      Tailwind unknown-class warnings.
- [ ] First Load JS ≤ 120 kB gzipped on `/`.

### Functional

- [ ] On first load with `localStorage` empty, the page is fully English.
- [ ] Toggle to Korean: every visible string switches, including the
      Result card after a simulation has run.
- [ ] Three preset cards (Healthy / Borderline / At-risk) each
      auto-populate the form, scroll to the simulator, run the API once,
      and display Path A / B / C respectively.
- [ ] Manual form submit also runs the API once and populates the
      Result card.
- [ ] Reset button clears form *and* clears the result.
- [ ] Errors from the API surface inline in the form (not in the result
      card), localized.
- [ ] Language preference persists across reload.

### Visual

- [ ] No raw hex values in any `.tsx` file (everything via Tailwind
      utilities derived from `tailwind.config.ts`).
- [ ] Score number is the largest type on the page when a result is
      shown.
- [ ] Path A/B/C cards in UsageGuide and the Pathway tag in Results use
      the same color encoding (green / amber / red).
- [ ] Privacy callout is visually distinct from the four step cards in
      HowItWorks.
- [ ] No emoji used as a structural icon. Lucide/Heroicons SVG only.

### Accessibility

- [ ] All interactive controls have visible focus rings.
- [ ] Slider value changes are read by VoiceOver.
- [ ] WCAG AA contrast on every text-bg pair (run a checker).
- [ ] Tab order is sensible top-to-bottom; the language toggle is
      reachable but not the first focus stop on load.
- [ ] `prefers-reduced-motion: reduce` disables all non-essential motion.

### Responsive

- [ ] iPhone SE (375×667): Hero readable, KPI 2×2, Simulator stacked,
      preset cards 1-up.
- [ ] iPad (768): KPI 4-up, simulator still stacked.
- [ ] Desktop (1280): Simulator side-by-side, preset cards 3-up.

### Bilingual

- [ ] No English text leaks when Korean is active (including pathway
      labels from the API).
- [ ] No Korean text leaks when English is active.
- [ ] The toggle pill itself reads `EN | 한국어` in both modes.

---

## 19. Hand-off contract

Before shipping, you must:

1. **Open with a one-paragraph design rationale**: concept + type pairing +
   color story + motion philosophy. Wait for explicit approval on this
   paragraph before changing files.
2. **Make changes in one coherent batch** — the user should not see a
   half-redesigned mid-state.
3. **Run the full acceptance checklist (§18)** and report each line.
4. **Provide before/after screenshots** of:
   - Hero (desktop + mobile)
   - Simulator with a populated result (desktop + mobile)
   - Korean mode of the same two views
5. **List anything you propose to change in `i18n.ts`** for
   confirmation — do not silently edit copy.

If anything in this brief conflicts with what you observe in the codebase,
flag it in your opening message rather than guessing. The brief is the
authority unless the codebase shows a contractual reason it cannot be.

---

## 20. Project file map  (so you don't have to grep)

```
risk_cont/                           project root
├── PROJECT.md                       full product brief
├── papers/                          4 published clinical studies (PDFs)
├── data/                            synthetic CSVs used by training
├── code/                            classifier training (already done)
├── figures/                         PPT figures (do not touch)
├── ppt/
│   ├── exec_summary_copy.md         PPT main 2 slides + Cover spec
│   └── appendix_copy.md             PPT appendix 5 slides spec
└── webapp/                          ← YOUR TURF
    ├── DESIGN_BRIEF.md              this file
    ├── README.md                    deploy guide
    ├── docker-compose.yml
    ├── nginx/lucida.conf
    ├── scripts/train_model.py
    ├── backend/                     locked
    │   ├── main.py
    │   ├── app/{schemas.py, inference.py}
    │   ├── models/lucida_rf.pkl
    │   └── Dockerfile
    └── frontend/                    rebuild the visual layer here
        ├── app/{layout.tsx, page.tsx, globals.css}
        ├── components/{Hero, UsageGuide, Simulator, Results, HowItWorks,
        │                Footer, LanguageContext, LanguageToggle}.tsx
        ├── lib/{i18n.ts, api.ts}
        ├── tailwind.config.ts
        └── Dockerfile
```

---

End of brief. Begin with your design rationale paragraph.
