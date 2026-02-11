import { Brain, PenTool, Share2, BarChart3, Shield, Headphones } from "lucide-react";

export default function WhatYouGet() {
  const features = [
    { icon: Brain, title: "AI Agents Op Maat", description: "Jouw agents worden getraind op jouw merk en doelgroep." },
    { icon: PenTool, title: "Automatische Content", description: "Van LinkedIn posts tot blogs—24/7 kwalitatieve content." },
    { icon: Share2, title: "Multi-Platform", description: "Automatisch publiceren op alle kanalen." },
    { icon: BarChart3, title: "Performance Dashboard", description: "Real-time inzicht in wat werkt." },
    { icon: Shield, title: "Veilig & Compliant", description: "Privacy-first met enterprise-grade beveiliging." },
    { icon: Headphones, title: "Dedicated Support", description: "Persoonlijke begeleiding, geen chatbots." },
  ];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-purple text-sm font-semibold uppercase">Alles Inbegrepen</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Wat Je Krijgt</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass-dark p-6 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-magenta/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-neon-purple" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
