/**
 * Legal documents — Privacy Policy, Terms of Service, Cookie Policy.
 * EN + KO. Compliant with Korean PIPA expectations and modern best
 * practices for low-risk research prototypes.
 */

export type LegalSection = {
  heading: string;
  body: string[]; // each string = one paragraph (or bullet group joined by \n)
};

export type LegalDoc = {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export type LegalDocs = {
  privacy: LegalDoc;
  terms: LegalDoc;
  cookies: LegalDoc;
};

const LAST_UPDATED = "2026-05-10";

// ────────────────────────────────────────────────────────────────────
// English
// ────────────────────────────────────────────────────────────────────
const EN: LegalDocs = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "Lucida (the “Service”) protects your personal information and complies with the Personal Information Protection Act (PIPA) of the Republic of Korea and equivalent international best practice. This policy explains exactly what we capture, what we never capture, and how it is handled.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. Information we collect",
        body: [
          "Processed in your browser only — never sent to the server:",
          "• The text content you type.\n• The identity (key code) of any individual key.\n• The order in which keys are pressed.",
          "Sent to the server (aggregate statistics only):",
          "• Mean and standard deviation of keystroke hold time and flight time.\n• Total keystroke count.\n• Age and sex you explicitly select.",
          "Automatically collected:",
          "• Standard web-server access logs (IP address, User-Agent, timestamp).\n• Browser localStorage value for language preference (key: lucida-lang).",
        ],
      },
      {
        heading: "2. How we use the information",
        body: [
          "Aggregate keystroke statistics are passed to a Random Forest classifier to compute a cognitive-trajectory score, a risk pathway, and an explanation. They are not stored.",
          "Web-server logs are used only for security, debugging, and abuse prevention.",
        ],
      },
      {
        heading: "3. Retention",
        body: [
          "• Aggregate statistics sent to the server are discarded immediately after the response is returned. The Service has no database for user inputs.",
          "• Web-server access logs are retained for 30 days, then automatically purged.",
          "• localStorage entries persist on your device until you clear them.",
        ],
      },
      {
        heading: "4. Sharing with third parties",
        body: [
          "We do not sell, lease, or share your personal information with third parties for commercial purposes.",
          "The Service loads the following external resources, which may receive your IP address and User-Agent as part of normal HTTP requests:",
          "• rsms.me — Inter font.\n• fonts.googleapis.com / fonts.gstatic.com — Source Serif 4 font.",
          "These services do not receive any of your typed content or computed scores.",
        ],
      },
      {
        heading: "5. Your rights",
        body: [
          "You may at any time:",
          "• Stop processing simply by closing the browser tab.\n• Clear localStorage from your browser settings (Settings → Site Data).\n• Request deletion of any access-log entry that contains your IP address by contacting the team (see §8).",
        ],
      },
      {
        heading: "6. Security",
        body: [
          "• All traffic is encrypted in transit (HTTPS / TLS 1.2+).\n• The server never receives or stores typed text content.\n• Feature extraction happens on-device (in your browser) for the Live Typing Lab.\n• The classifier itself is trained exclusively on synthetic data; no real user data was used in training.",
        ],
      },
      {
        heading: "7. Children",
        body: [
          "The Service is intended for adult research demonstration. We do not knowingly collect data from individuals under 14 years of age.",
        ],
      },
      {
        heading: "8. Contact",
        body: [
          "This Service is a research prototype submitted to the 4th National Risk Management Competition (Korea, 2026). For privacy-related inquiries:",
          "Team JEONNAM NICE\nSunchon National University",
        ],
      },
      {
        heading: "9. Changes to this policy",
        body: [
          "We may update this policy to reflect changes in law or service operation. Material changes will be reflected in the “Last updated” date below.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    intro:
      "These Terms of Service govern your use of Lucida (the “Service”). By accessing the Service you agree to these Terms.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. Nature of the Service",
        body: [
          "Lucida is a research prototype produced for the 4th National Risk Management Competition. It is not a medical device, diagnostic tool, insurance product, or financial service.",
          "All data shown by the Service — including baseline cohort distributions, simulator outputs, and the trained classifier itself — is synthetic or derived from synthetic training data calibrated to four published clinical studies.",
        ],
      },
      {
        heading: "2. Permitted use",
        body: [
          "• You may use the Service free of charge for personal, educational, and academic purposes.\n• Academic citation with attribution to Team JEONNAM NICE / Sunchon National University is welcome.\n• You may not use automated bots or scripts to issue bulk requests, scrape responses, or otherwise abuse the Service.",
        ],
      },
      {
        heading: "3. Accuracy of input",
        body: [
          "You are responsible for the accuracy of any information you enter. The Service makes no attempt to verify your inputs.",
        ],
      },
      {
        heading: "4. Intellectual property",
        body: [
          "All code, design, copy, and documentation are the property of Team JEONNAM NICE (Sunchon National University). The four clinical studies referenced are the intellectual property of their respective authors and publishers; the Service uses only published summary statistics.",
        ],
      },
      {
        heading: "5. Disclaimer of warranties",
        body: [
          "THE SERVICE IS PROVIDED “AS IS” WITHOUT ANY WARRANTY, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.",
          "Output of the Service must not be used as the basis for any medical, legal, employment, or financial decision.",
        ],
      },
      {
        heading: "6. Limitation of liability",
        body: [
          "To the maximum extent permitted by applicable law, the operators of the Service shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, the Service.",
        ],
      },
      {
        heading: "7. Governing law",
        body: [
          "These Terms are governed by the laws of the Republic of Korea, without regard to its conflict-of-law principles.",
        ],
      },
      {
        heading: "8. Changes to these Terms",
        body: [
          "We may update these Terms to reflect operational or legal changes. Continued use of the Service after a change constitutes acceptance of the updated Terms.",
        ],
      },
    ],
  },

  cookies: {
    title: "Cookie & Local-Storage Policy",
    intro:
      "Lucida does not use HTTP cookies for tracking, analytics, or advertising. This policy describes the limited browser-storage we do use and the third-party resources we load.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. HTTP cookies",
        body: [
          "We do not set any HTTP cookies on your browser.",
        ],
      },
      {
        heading: "2. Browser localStorage",
        body: [
          "We persist a single key in your browser’s localStorage:",
          "• lucida-lang — your selected interface language (en or ko).",
          "This key contains no personal information and is never read by any server.",
        ],
      },
      {
        heading: "3. How to clear stored data",
        body: [
          "• Browser settings: Settings → Site Settings → Site Data → Delete.\n• Developer Tools: Application tab → Local Storage → Clear.",
        ],
      },
      {
        heading: "4. Third-party assets",
        body: [
          "The Service loads fonts from the following external services:",
          "• rsms.me (Inter)\n• fonts.googleapis.com / fonts.gstatic.com (Source Serif 4)",
          "These requests expose your IP address and User-Agent to the relevant providers as part of normal HTTP behaviour. They do not receive any other information from this Service.",
        ],
      },
      {
        heading: "5. No analytics",
        body: [
          "The Service does not embed any analytics, tag manager, advertising pixel, or session-replay script.",
        ],
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────────────
// Korean
// ────────────────────────────────────────────────────────────────────
const KO: LegalDocs = {
  privacy: {
    title: "개인정보처리방침",
    intro:
      "Lucida(이하 “서비스”)는 사용자의 개인정보를 보호하며 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은 서비스가 무엇을 수집하고, 무엇을 절대 수집하지 않으며, 데이터를 어떻게 처리하는지 명확히 설명합니다.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. 수집 항목",
        body: [
          "브라우저에서만 처리 — 서버로 전송하지 않음:",
          "• 사용자가 입력한 텍스트 내용\n• 개별 키의 식별자(key code)\n• 키 입력 순서",
          "서버로 전송 (집계 통계만):",
          "• 키 입력 hold time / flight time의 평균 및 표준편차\n• 총 키 입력 수\n• 사용자가 직접 선택한 연령 및 성별",
          "자동 수집:",
          "• 표준 웹 서버 접근 로그(IP 주소, User-Agent, 접속 시각)\n• 브라우저 localStorage의 언어 설정값(키: lucida-lang)",
        ],
      },
      {
        heading: "2. 이용 목적",
        body: [
          "서버로 전송된 집계 통계는 Random Forest 분류기에 입력되어 인지 궤적 점수, 위험 경로, 그리고 설명 데이터를 산출하는 데 사용되며, 그 외에 저장되지 않습니다.",
          "웹 서버 로그는 보안, 디버깅, 어뷰즈 방지 목적으로만 사용됩니다.",
        ],
      },
      {
        heading: "3. 보유 기간",
        body: [
          "• 서버로 전송된 집계 통계는 응답 반환 직후 폐기됩니다. 서비스는 사용자 입력을 저장하는 데이터베이스를 운영하지 않습니다.",
          "• 웹 서버 접근 로그는 30일간 보관 후 자동 삭제됩니다.",
          "• localStorage 항목은 사용자가 직접 삭제하기 전까지 단말에 유지됩니다.",
        ],
      },
      {
        heading: "4. 제3자 제공",
        body: [
          "서비스는 어떠한 경우에도 사용자 정보를 상업적 목적으로 제3자에게 판매·임대·제공하지 않습니다.",
          "단, 서비스는 다음의 외부 리소스를 로드하며, 정상적인 HTTP 요청 과정에서 사용자 IP 주소 및 User-Agent가 해당 서비스로 전송될 수 있습니다:",
          "• rsms.me — Inter 폰트\n• fonts.googleapis.com / fonts.gstatic.com — Source Serif 4 폰트",
          "해당 외부 서비스는 사용자가 입력한 텍스트나 산출된 점수 등 다른 정보를 일절 받지 않습니다.",
        ],
      },
      {
        heading: "5. 정보주체의 권리",
        body: [
          "사용자는 언제든지 다음 권리를 행사할 수 있습니다:",
          "• 브라우저 탭을 닫음으로써 처리를 즉시 중단합니다.\n• 브라우저 설정(설정 → 사이트 데이터)에서 localStorage를 삭제합니다.\n• IP 주소가 포함된 접근 로그 항목의 삭제를 §8 연락처를 통해 요청할 수 있습니다.",
        ],
      },
      {
        heading: "6. 보안 조치",
        body: [
          "• 모든 통신은 HTTPS / TLS 1.2 이상으로 암호화됩니다.\n• 서버는 입력 텍스트를 수신·저장하지 않습니다.\n• 실시간 타이핑 랩의 특성 추출은 단말(브라우저) 내에서 수행됩니다.\n• 분류기 자체는 합성 데이터로만 학습되었으며, 실제 사용자 데이터는 학습에 사용되지 않았습니다.",
        ],
      },
      {
        heading: "7. 아동 정보 처리",
        body: [
          "본 서비스는 성인 대상 연구 데모를 목적으로 합니다. 서비스는 만 14세 미만 아동의 정보를 의도적으로 수집하지 않습니다.",
        ],
      },
      {
        heading: "8. 책임자 및 문의처",
        body: [
          "본 서비스는 제4회 전국 대학(원)생 리스크 관리 경진대회에 출품된 연구 프로토타입입니다. 개인정보 관련 문의는 다음으로 연락 주십시오:",
          "Team JEONNAM NICE\n국립순천대학교",
        ],
      },
      {
        heading: "9. 처리방침 변경",
        body: [
          "본 처리방침은 법령 변경 또는 서비스 운영 변경에 따라 수정될 수 있습니다. 중대한 변경은 아래 “최종 업데이트” 일자에 반영됩니다.",
        ],
      },
    ],
  },

  terms: {
    title: "이용약관",
    intro:
      "본 약관은 Lucida(이하 “서비스”)의 이용 조건을 정합니다. 사용자는 서비스에 접속함으로써 본 약관에 동의한 것으로 간주됩니다.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "제1조 (서비스의 성격)",
        body: [
          "Lucida는 제4회 전국 대학(원)생 리스크 관리 경진대회 출품을 위해 제작된 연구 프로토타입입니다. 의료기기, 진단 도구, 보험상품, 금융 서비스가 아닙니다.",
          "서비스가 표시하는 모든 데이터 — 기준 코호트 분포, 시뮬레이터 출력, 학습된 분류기 자체 — 는 합성 데이터이거나, 4편의 발표된 임상 연구 통계로 보정된 합성 학습 데이터에서 파생된 것입니다.",
        ],
      },
      {
        heading: "제2조 (이용 조건)",
        body: [
          "• 사용자는 개인적·교육적·학술적 목적으로 무료로 서비스를 이용할 수 있습니다.\n• Team JEONNAM NICE / 국립순천대학교 출처 명시 후 학술 인용은 자유롭게 가능합니다.\n• 자동화된 봇 또는 스크립트를 이용한 대량 요청, 응답 스크래핑, 그 외 어뷰즈 행위는 금지됩니다.",
        ],
      },
      {
        heading: "제3조 (입력 정확성)",
        body: [
          "사용자가 입력한 정보의 정확성은 사용자 본인이 책임집니다. 서비스는 입력 검증을 수행하지 않습니다.",
        ],
      },
      {
        heading: "제4조 (지적재산권)",
        body: [
          "서비스에 사용된 모든 코드, 디자인, 카피, 문서의 저작권은 Team JEONNAM NICE(국립순천대학교)에 귀속됩니다. 참조된 4편의 임상 연구는 각 저자 및 출판사의 지적 재산이며, 서비스는 발표된 요약 통계만을 사용합니다.",
        ],
      },
      {
        heading: "제5조 (보증의 부인)",
        body: [
          "서비스는 명시적·묵시적 보증 없이 “있는 그대로(AS IS)” 제공됩니다. 상품성, 특정 목적 적합성, 비침해 보증 등은 일절 보증하지 않습니다.",
          "서비스의 출력은 어떠한 의료적·법적·고용·재무 의사결정의 근거로 사용될 수 없습니다.",
        ],
      },
      {
        heading: "제6조 (책임의 제한)",
        body: [
          "관련 법이 허용하는 최대 한도 내에서, 서비스 운영자는 서비스 이용 또는 이용 불능과 관련하여 발생한 어떠한 직접적·간접적·부수적·결과적·징벌적 손해에도 책임을 지지 않습니다.",
        ],
      },
      {
        heading: "제7조 (준거법)",
        body: [
          "본 약관은 대한민국 법령에 따라 해석되며, 충돌법 원칙은 적용되지 않습니다.",
        ],
      },
      {
        heading: "제8조 (약관의 변경)",
        body: [
          "본 약관은 운영상 또는 법적 사유로 변경될 수 있으며, 변경 후에도 서비스를 계속 이용하는 것은 변경된 약관에 대한 동의로 간주됩니다.",
        ],
      },
    ],
  },

  cookies: {
    title: "쿠키 및 로컬 저장소 정책",
    intro:
      "Lucida는 추적·분석·광고 목적의 HTTP 쿠키를 사용하지 않습니다. 본 정책은 서비스가 사용하는 제한적인 브라우저 저장소와 외부에서 로드하는 리소스를 설명합니다.",
    lastUpdated: LAST_UPDATED,
    sections: [
      {
        heading: "1. HTTP 쿠키",
        body: [
          "서비스는 어떠한 HTTP 쿠키도 사용자의 브라우저에 설정하지 않습니다.",
        ],
      },
      {
        heading: "2. 브라우저 localStorage",
        body: [
          "서비스는 단 하나의 키를 브라우저의 localStorage에 저장합니다:",
          "• lucida-lang — 사용자가 선택한 인터페이스 언어 (en 또는 ko)",
          "이 항목은 어떠한 개인정보도 포함하지 않으며 서버로 전송되지 않습니다.",
        ],
      },
      {
        heading: "3. 저장된 데이터 삭제 방법",
        body: [
          "• 브라우저 설정: 설정 → 사이트 설정 → 사이트 데이터 → 삭제\n• 개발자 도구: Application 탭 → Local Storage → Clear",
        ],
      },
      {
        heading: "4. 외부 리소스",
        body: [
          "서비스는 다음 외부 서비스로부터 폰트를 로드합니다:",
          "• rsms.me (Inter)\n• fonts.googleapis.com / fonts.gstatic.com (Source Serif 4)",
          "정상적인 HTTP 요청 과정에서 사용자 IP 주소와 User-Agent가 해당 제공자에게 노출될 수 있으며, 그 외 정보는 전송되지 않습니다.",
        ],
      },
      {
        heading: "5. 분석 도구 미사용",
        body: [
          "서비스는 분석 도구, 태그 매니저, 광고 픽셀, 세션 리플레이 스크립트 등을 일절 포함하지 않습니다.",
        ],
      },
    ],
  },
};

export const legalDocs: Record<"en" | "ko", LegalDocs> = { en: EN, ko: KO };

// ── Footer link labels ──────────────────────────────────────────────
export const legalLabels = {
  en: {
    legalHead: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    cookies: "Cookie Policy",
    backHome: "← Back to Lucida",
    lastUpdated: "Last updated",
  },
  ko: {
    legalHead: "법적 정보",
    privacy: "개인정보처리방침",
    terms: "이용약관",
    cookies: "쿠키 정책",
    backHome: "← Lucida로 돌아가기",
    lastUpdated: "최종 업데이트",
  },
};
