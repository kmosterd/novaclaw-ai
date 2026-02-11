import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import AgentChat from "@/components/AgentChat";

const ParticleField = dynamic(() => import("@/components/three/ParticleField"), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <ParticleField />
      <Navbar />
      <section id="contact" className="pt-16"><Hero /></section>
      <section id="hoe-het-werkt"><HowItWorks /></section>
      <section id="wat-je-krijgt"><WhatYouGet /></section>
      <section id="prijzen"><Pricing /></section>
      <About />
      <FAQ />
      <Footer />
      <AgentChat />
    </main>
  );
}
