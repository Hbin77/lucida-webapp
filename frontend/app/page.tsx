"use client";

import Hero from "@/components/Hero";
import UsageGuide from "@/components/UsageGuide";
import Simulator from "@/components/Simulator";
import LiveTypingLab from "@/components/LiveTypingLab";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Page() {
  const scrollTo = (id: string) => {
    if (typeof document === "undefined") return;
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <main>
        <Hero
          onStart={() => scrollTo("how-to-use")}
          onHow={() => scrollTo("how-it-works")}
        />
        <UsageGuide />
        <Simulator />
        <LiveTypingLab />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
