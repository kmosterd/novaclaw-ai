import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import { getServerLang } from "@/lib/i18n";

const copy = {
  nl: {
    badge: "Gratis Tool",
    title: "AI Agent ROI Calculator",
    subtitle:
      "Bereken in 2 minuten hoeveel je bespaart met AI agents. Gepersonaliseerd voor jouw bedrijf.",
    items: [
      "Selecteer de agents die je wilt inzetten",
      "Zie je maandelijkse en jaarlijkse besparing",
      "Ontdek je terugverdientijd in dagen",
      "Krijg een persoonlijk planadvies",
    ],
    button: "Start Gratis Calculator",
  },
  en: {
    badge: "Free Tool",
    title: "AI Agent ROI Calculator",
    subtitle:
      "Calculate in 2 minutes how much you save with AI agents. Personalized for your business.",
    items: [
      "Select the agents you want to deploy",
      "See your monthly and yearly savings",
      "Discover your payback period in days",
      "Get a personalized plan recommendation",
    ],
    button: "Start Free Calculator",
  },
};

export default async function LeadMagnetCTA() {
  const lang = await getServerLang();
  const t = copy[lang];

  return (
    <div className="glass-dark rounded-2xl overflow-hidden border border-neon-purple/20">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 md:items-center">
          {/* Left: Info */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 mb-3">
              <Calculator className="w-3 h-3" />
              {t.badge}
            </span>

            <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              {t.subtitle}
            </p>

            <ul className="space-y-2">
              {t.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-white/60"
                >
                  <span className="text-neon-cyan mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: CTA */}
          <div className="flex-shrink-0">
            <Link
              href="/tools/roi-calculator"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
            >
              {t.button}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
