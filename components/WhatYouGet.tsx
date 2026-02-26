import { Brain, PenTool, Share2, BarChart3, Shield, Headphones } from "lucide-react";
import { getServerLang } from "@/lib/i18n";
import { whatYouGetT } from "@/lib/translations";

const featureIcons = [Brain, PenTool, Share2, BarChart3, Shield, Headphones];

export default async function WhatYouGet() {
  const lang = await getServerLang();
  const t = whatYouGetT[lang];

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-purple text-sm font-semibold uppercase">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {t.heading}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.map((feature, idx) => {
            const Icon = featureIcons[idx];
            return (
              <div
                key={idx}
                className="glass-dark p-6 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-magenta/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
