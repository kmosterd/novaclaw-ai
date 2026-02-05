import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import AgentChat from "@/components/AgentChat";

// Dynamic import for 3D component to prevent SSR issues
const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative">
      {/* 3D Background */}
      <ParticleField />

      {/* Hero Section */}
      <Hero />

      {/* AI Chat Widget */}
      <AgentChat />
    </main>
  );
}
