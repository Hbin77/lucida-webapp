/**
 * Lucida — bilingual content (EN default, KO opt-in).
 *
 * Hard rules:
 * - Adding a new key requires the same key in BOTH languages.
 * - The team / school / member names below are the authoritative copy
 *   (Team JEONNAM NICE, Sunchon National University, real members).
 * - "AUC", "MoCA-K", "n=111" remain as-is in both languages.
 */

export type Lang = "en" | "ko";

type Dict = {
  lang: { switchTo: string; en: string; ko: string };
  nav: { skipToContent: string };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    kpi: {
      agedLabel: string;  agedValue: string;  agedFoot: string;
      casesLabel: string; casesValue: string; casesFoot: string;
      costLabel: string;  costValue: string;  costFoot: string;
      delayLabel: string; delayValue: string; delayFoot: string;
    };
  };
  guide: {
    eyebrow: string; title: string; body: string;
    presetsLabel: string;
    presets: {
      healthy:    { tag: string; title: string; body: string; run: string };
      borderline: { tag: string; title: string; body: string; run: string };
      atrisk:     { tag: string; title: string; body: string; run: string };
    };
    steps: {
      s1: { n: string; h: string; p: string };
      s2: { n: string; h: string; p: string };
      s3: { n: string; h: string; p: string };
    };
  };
  sim: {
    eyebrow: string; title: string;
    formTitle: string; resultTitle: string;
    field: {
      age: string;       ageHelp: string;
      sex: string;       sexHelp: string;
      speed: string;     speedHelp: string;
      variance: string;  varianceHelp: string;
    };
    level: {
      slow: string; below: string; above: string; fast: string;
      stable: string; moderate: string; inconsistent: string; erratic: string;
    };
    sex: { F: string; M: string };
    btn: { run: string; running: string; reset: string };
    placeholder: { title: string; body: string };
    loading: string;
    errorGeneric: string;
  };
  res: {
    score: string; scoreOutOf: string;
    confidenceLabel: string;
    confidence: { low: string; medium: string; high: string };
    premium: string; premiumChange: string;
    delay: string; delayUnit: string;
    outlookTitle: string;
    withoutLabel: string; withLabel: string;
    outlookReduction: string; outlookReductionTail: string; outlookRel: string;
    derivedTitle: string; derivedHint: string;
    pathway: {
      A: { label: string; description: string };
      B: { label: string; description: string };
      C: { label: string; description: string };
    };
    disclaimer: string;
  };
  how: {
    eyebrow: string; title: string;
    step: {
      s1: { n: string; h: string; p: string };
      s2: { n: string; h: string; p: string };
      s3: { n: string; h: string; p: string };
      s4: { n: string; h: string; p: string };
    };
    privacyTitle: string; privacyBody: string;
  };
  footer: {
    tagline: string;
    teamHead: string; teamName: string; school: string; members: string;
    submitHead: string; competition: string; hosts: string; date: string;
    rights: string;
    modelLive: string;
  };

  lab: {
    eyebrow: string;
    title: string;
    body: string;
    samplePassage: string;
    placeholder: string;
    typeMore: string;          // "Type at least N keystrokes to enable analysis"
    keystrokes: string;
    holdTime: string;
    flightTime: string;
    variability: string;
    minimum: string;
    cohortHc: string;
    cohortMci: string;
    youAre: string;            // "You are here"
    htDistTitle: string;
    ftDistTitle: string;
    timelineTitle: string;
    privacyWhat: string;       // "Captured"
    privacyNot: string;        // "Ignored"
    privacyCapturedHead: string;
    privacyIgnoredHead: string;
    btnAnalyze: string;
    btnAnalyzing: string;
    btnReset: string;
    explainTitle: string;
    explainHint: string;
    cohortDistanceTitle: string;
    cohortDistanceHint: string;
    featureLabels: {
      avg_ht: string;
      std_ht: string;
      avg_ft: string;
      std_ft: string;
      avg_keys_per_session: string;
      age: string;
    };
    note: string;              // "These are real measurements from your typing."
  };
};

export type Translations = Dict;

export const translations: Record<Lang, Dict> = {
  en: {
    lang: { switchTo: "Switch language", en: "EN", ko: "한국어" },
    nav: { skipToContent: "Skip to content" },

    hero: {
      eyebrow: "Cognitive risk · Long-term care",
      titleLine1: "Underwriting that adapts",
      titleLine2: "before the diagnosis arrives.",
      body: "Lucida reads passive keystroke timing on a phone the customer already owns, scores cognitive trajectory against four published clinical cohorts, and re-prices long-term care insurance on three dynamic pathways.",
      ctaPrimary: "Try the simulator",
      ctaSecondary: "How it works",
      kpi: {
        agedLabel: "Korea, by 2026",
        agedValue: "Super-aged",
        agedFoot: "20%+ of population aged 65+",
        casesLabel: "Diagnosed dementia",
        casesValue: "1.05M",
        casesFoot: "South Korea, 2024",
        costLabel: "Annual social cost",
        costValue: "₩24T",
        costFoot: "Direct + indirect, 2024",
        delayLabel: "Onset delay window",
        delayValue: "7–10 yr",
        delayFoot: "Pre-clinical biomarker change",
      },
    },

    guide: {
      eyebrow: "How to use",
      title: "Move four sliders. Read one score. In ninety seconds.",
      body: "Each preset loads four inputs the model needs and runs the classifier once. You can also adjust manually below.",
      presetsLabel: "Quick-load a profile",
      presets: {
        healthy:    { tag: "Path A", title: "Healthy adult", body: "Stable rhythm, age 45.",     run: "Load profile" },
        borderline: { tag: "Path B", title: "Borderline",    body: "Slowed cadence, age 60.",    run: "Load profile" },
        atrisk:     { tag: "Path C", title: "At-risk",       body: "Erratic latency, age 70.",   run: "Load profile" },
      },
      steps: {
        s1: { n: "01", h: "Set the four inputs", p: "Age, sex, typing speed, latency variance — the classifier's only inputs." },
        s2: { n: "02", h: "Run",                 p: "One call to the trained RandomForest. Average 180 ms server time." },
        s3: { n: "03", h: "Read the result",     p: "Score, pathway, premium, 5-year outlook with and without intervention." },
      },
    },

    sim: {
      eyebrow: "Simulator",
      title: "Run the classifier on a profile.",
      formTitle: "Inputs",
      resultTitle: "Result",
      field: {
        age:      "Age",
        ageHelp:  "Risk prior. Range 30–85.",
        sex:      "Sex at birth",
        sexHelp:  "Adjusts the population baseline used by the prior.",
        speed:    "Typing speed",
        speedHelp:"Mean keys per minute. Maps to keys-per-session feature.",
        variance: "Latency variance",
        varianceHelp: "Stability of inter-key intervals. Higher = noisier rhythm.",
      },
      level: {
        slow: "Slow", below: "Below average", above: "Above average", fast: "Fast",
        stable: "Very stable", moderate: "Moderate", inconsistent: "Inconsistent", erratic: "Erratic",
      },
      sex: { F: "Female", M: "Male" },
      btn: { run: "Run simulation", running: "Simulating…", reset: "Reset" },
      placeholder: {
        title: "No simulation yet.",
        body: "Set the four inputs on the left and run the classifier, or load a preset above.",
      },
      loading: "Running classifier…",
      errorGeneric: "Couldn't reach the model. Please retry.",
    },

    res: {
      score: "Cognitive score",
      scoreOutOf: "/ 100",
      confidenceLabel: "Confidence",
      confidence: { low: "Low", medium: "Medium", high: "High" },
      premium: "Monthly premium",
      premiumChange: "vs. baseline",
      delay: "Estimated AD-onset delay",
      delayUnit: "months",
      outlookTitle: "5-year cognitive-decline probability",
      withoutLabel: "Without intervention",
      withLabel: "With Lucida intervention",
      outlookReduction: "Absolute reduction of",
      outlookReductionTail: "percentage points",
      outlookRel: "— a relative drop of",
      derivedTitle: "Derived model features",
      derivedHint: "Six features the classifier actually sees.",
      pathway: {
        A: {
          label: "Path A · Healthy",
          description: "Trajectory consistent with cognitively normal aging. Annual passive monitoring; premium discount applies.",
        },
        B: {
          label: "Path B · Early decline",
          description: "Subtle motor-cognitive slowing detectable. Quarterly re-screen plus structured intervention re-prices the policy at the next review.",
        },
        C: {
          label: "Path C · Established decline",
          description: "Pattern consistent with prodromal or established impairment. Clinical referral recommended; underwriting moves to the impaired-life schedule.",
        },
      },
      disclaimer: "Lucida is a research demonstrator, not a medical device. The score is not a diagnosis. Synthetic-data trained classifier; clinical deployment requires regulatory review.",
    },

    how: {
      eyebrow: "Method",
      title: "Four steps from typing to premium.",
      step: {
        s1: { n: "01", h: "Capture",  p: "On-device keystroke timing — hold time and flight time only. No content, no keys, no metadata." },
        s2: { n: "02", h: "Extract",  p: "Six aggregated features per session: avg/std hold, avg/std flight, keys-per-session, age." },
        s3: { n: "03", h: "Classify", p: "RandomForest calibrated against four published cohorts. AUC 0.957 on flight-time features alone." },
        s4: { n: "04", h: "Re-price", p: "Score is mapped to one of three pathways; premium adjusts on the next review." },
      },
      privacyTitle: "Privacy by design",
      privacyBody: "We never capture text content, key identities, screenshots, location, or contacts. Only aggregated millisecond-level inter-key intervals leave the device. Raw timestamps are discarded after feature extraction.",
    },

    footer: {
      tagline: "Underwriting that adapts before the diagnosis arrives.",
      teamHead: "Team",
      teamName: "Team JEONNAM NICE",
      school: "Sunchon National University",
      members: "Hyunbin Park (Lead) · Gayeon Kim · Hanbyeol Park · Dahae Lee",
      submitHead: "Submission",
      competition: "4th National Risk Management Competition",
      hosts: "Samsung Fire & Marine · POSTECH · SNU",
      date: "Submission · 2026-05-15",
      rights: "Lucida is a research prototype produced for academic competition use. Data shown is synthetic. Not for clinical or commercial use.",
      modelLive: "model live",
    },

    lab: {
      eyebrow: "Live typing lab",
      title: "Type. We see only timing.",
      body: "Type the passage below. Your browser measures hold time and flight time of each key with microsecond precision and aggregates them with Welford's online algorithm. The text content stays on your device — only six aggregate statistics are sent to the model.",
      samplePassage: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.",
      placeholder: "Start typing here…",
      typeMore: "Type at least {n} keystrokes to enable analysis.",
      keystrokes: "Keystrokes",
      holdTime: "Hold time",
      flightTime: "Flight time",
      variability: "Variance",
      minimum: "min. 30",
      cohortHc: "Park 2024 · HC",
      cohortMci: "Park 2024 · MCI",
      youAre: "You",
      htDistTitle: "Hold-time distribution (ms)",
      ftDistTitle: "Flight-time distribution (ms)",
      timelineTitle: "Session rhythm — last 64 keystrokes",
      privacyWhat: "Captured",
      privacyNot: "Ignored",
      privacyCapturedHead: "Timing only",
      privacyIgnoredHead: "Your text never leaves the page",
      btnAnalyze: "Run on real measurements",
      btnAnalyzing: "Running…",
      btnReset: "Clear session",
      explainTitle: "Per-feature contribution",
      explainHint: "How each feature pushes the score away from a fully-healthy baseline (HC = 100). Negative bars pull the score down; positive bars push it up. Computed by single-feature ablation against the model.",
      cohortDistanceTitle: "Cohort distance",
      cohortDistanceHint: "Standardised Euclidean distance to each published cohort centroid. Smaller = closer. The closest cohort is the one your typing most resembles.",
      featureLabels: {
        avg_ht: "Hold time · mean",
        std_ht: "Hold time · variance",
        avg_ft: "Flight time · mean",
        std_ft: "Flight time · variance",
        avg_keys_per_session: "Keys / session",
        age: "Age",
      },
      note: "These six numbers are the only thing the model sees.",
    },
  },

  ko: {
    lang: { switchTo: "언어 전환", en: "EN", ko: "한국어" },
    nav: { skipToContent: "본문 바로가기" },

    hero: {
      eyebrow: "인지 위험 · 장기요양",
      titleLine1: "진단이 도착하기 전에",
      titleLine2: "조정되는 언더라이팅.",
      body: "Lucida는 고객이 이미 사용 중인 휴대폰에서 키 입력 타이밍을 수동적으로 읽어, 4편의 임상 코호트에 보정된 분류기로 인지 궤적을 점수화하고, 장기요양보험을 세 가지 동적 경로로 재가격합니다.",
      ctaPrimary: "시뮬레이터 시작",
      ctaSecondary: "작동 원리",
      kpi: {
        agedLabel: "한국 · 2026",
        agedValue: "초고령사회",
        agedFoot: "65세 이상 인구 20% 이상",
        casesLabel: "치매 진단자",
        casesValue: "105만",
        casesFoot: "대한민국 · 2024",
        costLabel: "연간 사회적 비용",
        costValue: "24조 원",
        costFoot: "직간접 합계 · 2024",
        delayLabel: "발병 지연 창",
        delayValue: "7–10년",
        delayFoot: "전임상 바이오마커 변화",
      },
    },

    guide: {
      eyebrow: "사용 방법",
      title: "슬라이더 4개. 점수 1개. 90초.",
      body: "각 프리셋은 모델이 필요로 하는 4개 입력을 불러와 분류기를 한 번 실행합니다. 아래에서 직접 조정할 수도 있습니다.",
      presetsLabel: "프로필 빠르게 불러오기",
      presets: {
        healthy:    { tag: "Path A", title: "건강한 성인", body: "안정된 리듬, 45세.",   run: "프로필 로드" },
        borderline: { tag: "Path B", title: "경계",       body: "느려진 박자, 60세.",   run: "프로필 로드" },
        atrisk:     { tag: "Path C", title: "고위험",     body: "불규칙한 지연, 70세.", run: "프로필 로드" },
      },
      steps: {
        s1: { n: "01", h: "네 가지 입력 설정", p: "연령, 성별, 타이핑 속도, 지연 변동성 — 분류기가 보는 모든 입력." },
        s2: { n: "02", h: "실행",            p: "학습된 RandomForest 한 번 호출. 평균 서버 시간 180 ms." },
        s3: { n: "03", h: "결과 확인",        p: "점수, 경로, 보험료, 개입 유무에 따른 5년 전망." },
      },
    },

    sim: {
      eyebrow: "시뮬레이터",
      title: "프로필로 분류기를 실행하세요.",
      formTitle: "입력",
      resultTitle: "결과",
      field: {
        age:      "연령",
        ageHelp:  "사전 위험. 30–85세.",
        sex:      "출생 시 성별",
        sexHelp:  "사전 위험에 사용되는 모집단 기준선을 조정합니다.",
        speed:    "타이핑 속도",
        speedHelp:"분당 평균 키 입력 수. 세션당 키 입력 특성에 매핑됩니다.",
        variance: "지연 변동성",
        varianceHelp: "키 입력 간격의 안정성. 클수록 리듬이 흐트러집니다.",
      },
      level: {
        slow: "느림", below: "평균 이하", above: "평균 이상", fast: "빠름",
        stable: "매우 안정", moderate: "보통", inconsistent: "일관성 부족", erratic: "불규칙",
      },
      sex: { F: "여성", M: "남성" },
      btn: { run: "시뮬레이션 실행", running: "실행 중…", reset: "초기화" },
      placeholder: {
        title: "아직 결과가 없습니다.",
        body: "왼쪽에서 입력 4개를 설정하고 분류기를 실행하거나, 위의 프리셋을 불러오세요.",
      },
      loading: "분류기 실행 중…",
      errorGeneric: "모델에 연결할 수 없습니다. 다시 시도하세요.",
    },

    res: {
      score: "인지 점수",
      scoreOutOf: "/ 100",
      confidenceLabel: "신뢰도",
      confidence: { low: "낮음", medium: "보통", high: "높음" },
      premium: "월 보험료",
      premiumChange: "기준선 대비",
      delay: "예상 알츠하이머 발병 지연",
      delayUnit: "개월",
      outlookTitle: "5년 인지 저하 확률",
      withoutLabel: "개입 없음",
      withLabel: "Lucida 개입",
      outlookReduction: "절대 감소",
      outlookReductionTail: "%포인트",
      outlookRel: "— 상대 감소율",
      derivedTitle: "파생 모델 특성",
      derivedHint: "분류기가 실제로 보는 6개 특성.",
      pathway: {
        A: {
          label: "Path A · 건강",
          description: "정상 인지 노화와 일치하는 궤적입니다. 연 1회 패시브 모니터링 적용, 보험료 할인이 부여됩니다.",
        },
        B: {
          label: "Path B · 초기 저하",
          description: "미세한 운동-인지 둔화가 감지됩니다. 분기별 재선별과 구조화된 개입을 적용하면 다음 검토 시점에 재가격됩니다.",
        },
        C: {
          label: "Path C · 확립된 저하",
          description: "전임상 또는 확립된 손상과 일치하는 패턴입니다. 임상 의뢰를 권고하며, 손상 생애 표준 언더라이팅으로 이동합니다.",
        },
      },
      disclaimer: "Lucida는 연구용 데모이며 의료기기가 아닙니다. 점수는 진단이 아닙니다. 합성 데이터로 학습된 분류기이며, 임상 도입에는 규제 검토가 필요합니다.",
    },

    how: {
      eyebrow: "방법",
      title: "타이핑에서 보험료까지, 네 단계.",
      step: {
        s1: { n: "01", h: "수집",   p: "단말 내 키 입력 타이밍 — hold time과 flight time만. 콘텐츠·키·메타데이터는 전송하지 않습니다." },
        s2: { n: "02", h: "추출",   p: "세션당 6개 집계 특성: hold 평균/표준편차, flight 평균/표준편차, 세션당 키 수, 연령." },
        s3: { n: "03", h: "분류",   p: "4편의 임상 코호트로 보정된 RandomForest. flight time만으로 AUC 0.957." },
        s4: { n: "04", h: "재가격", p: "점수는 세 경로 중 하나에 매핑되고, 보험료는 다음 검토 시점에 조정됩니다." },
      },
      privacyTitle: "설계 단계의 프라이버시",
      privacyBody: "텍스트 내용, 키 식별자, 스크린샷, 위치, 연락처는 어떤 경우에도 수집하지 않습니다. 단말을 떠나는 것은 밀리초 단위 키 간격의 집계뿐입니다. 원시 타임스탬프는 특성 추출 후 폐기합니다.",
    },

    footer: {
      tagline: "진단이 도착하기 전에 조정되는 언더라이팅.",
      teamHead: "팀",
      teamName: "Team JEONNAM NICE",
      school: "국립순천대학교",
      members: "박현빈 (팀장) · 김가연 · 박한별 · 이다해",
      submitHead: "제출",
      competition: "제4회 전국 대학(원)생 리스크 관리 경진대회",
      hosts: "삼성화재 · POSTECH · 서울대",
      date: "제출 · 2026-05-15",
      rights: "Lucida는 학술 경진대회 목적으로 제작된 연구 프로토타입입니다. 표시된 데이터는 합성 데이터입니다. 임상·상업적 용도로 사용할 수 없습니다.",
      modelLive: "모델 작동 중",
    },

    lab: {
      eyebrow: "실시간 타이핑 랩",
      title: "타이핑하세요. 타이밍만 봅니다.",
      body: "아래 문장을 입력하세요. 브라우저가 각 키의 hold time과 flight time을 마이크로초 정밀도로 측정하고 Welford의 온라인 알고리즘으로 집계합니다. 텍스트는 단말을 떠나지 않으며, 6개 집계 통계만 모델로 전송됩니다.",
      samplePassage: "다람쥐 헌 쳇바퀴에 타고파. 빠르게 그리고 정확하게 타이핑하면 된다.",
      placeholder: "여기에 입력하세요…",
      typeMore: "분석을 활성화하려면 {n}회 이상 입력하세요.",
      keystrokes: "키 입력",
      holdTime: "Hold time",
      flightTime: "Flight time",
      variability: "변동성",
      minimum: "최소 30",
      cohortHc: "Park 2024 · HC",
      cohortMci: "Park 2024 · MCI",
      youAre: "현재",
      htDistTitle: "Hold-time 분포 (ms)",
      ftDistTitle: "Flight-time 분포 (ms)",
      timelineTitle: "세션 리듬 — 최근 64회",
      privacyWhat: "수집",
      privacyNot: "무시",
      privacyCapturedHead: "타이밍만",
      privacyIgnoredHead: "입력 내용은 페이지를 떠나지 않습니다",
      btnAnalyze: "실측값으로 실행",
      btnAnalyzing: "실행 중…",
      btnReset: "세션 초기화",
      explainTitle: "특성별 기여도",
      explainHint: "각 특성이 완전 건강 기준선(HC = 100)에서 점수를 얼마나 끌어내리거나 올리는지 보여줍니다. 모델에 대한 단일 특성 ablation으로 계산됩니다.",
      cohortDistanceTitle: "코호트 거리",
      cohortDistanceHint: "각 발표된 코호트 중심점에 대한 표준화 유클리드 거리입니다. 작을수록 가깝습니다. 가장 가까운 코호트가 사용자의 타이핑과 가장 유사합니다.",
      featureLabels: {
        avg_ht: "Hold time · 평균",
        std_ht: "Hold time · 변동성",
        avg_ft: "Flight time · 평균",
        std_ft: "Flight time · 변동성",
        avg_keys_per_session: "세션당 키 수",
        age: "연령",
      },
      note: "이 여섯 숫자가 모델이 보는 전부입니다.",
    },
  },
};
