import { Shield, Zap, Users } from "lucide-react";
import { getServerLang } from "@/lib/i18n";
import { aboutT } from "@/lib/translations";

const featureIcons = [Zap, Shield, Users];
const featureColors = ["neon-cyan", "neon-purple", "neon-magenta"];

export default async function About() {
  const lang = await getServerLang();
  const t = aboutT[lang];

  return (
    <section
      id="over-ons"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
    >
      <div className="text-center mb-16">
        <p className="text-neon-magenta text-sm font-semibold tracking-widest uppercase mb-3">
          {t.sectionLabel}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          {t.heading}
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
          {t.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.features.map((feature, idx) => {
          const Icon = featureIcons[idx];
          const color = featureColors[idx];
          return (
            <div key={idx} className="glass-dark rounded-2xl p-8 text-center">
              <div
                className={`w-14 h-14 rounded-xl bg-${color}/10 flex items-center justify-center mx-auto mb-5`}
              >
                <Icon className={`text-${color}`} size={28} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
