import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import Pricing from "@/components/Pricing";
import AgentChat from "@/components/AgentChat";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <ParticleField />
      <section id="contact"><Hero /></section>
      <HowItWorks />
      <WhatYouGet />
      <Pricing />
      <AgentChat />
    </main>
  );
}
