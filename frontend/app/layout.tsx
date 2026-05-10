import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import TopMark from "@/components/TopMark";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucida — Cognitive risk underwriting",
  description:
    "Lucida re-prices long-term care insurance against passive keystroke-derived cognitive trajectories. Research demonstrator for the 4th National Risk Management Competition.",
  openGraph: {
    title: "Lucida — Risk Simulator",
    description:
      "Underwriting that adapts before the diagnosis arrives.",
    url: "https://lucida.hbinserver.cloud",
    siteName: "Lucida",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <a href="#hero-heading" className="sr-only">
            Skip to content
          </a>
          <TopMark />
          <LanguageToggle />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
