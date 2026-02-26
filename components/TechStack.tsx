import { getServerLang } from "@/lib/i18n";
import { techStackT } from "@/lib/translations";

export default async function TechStack() {
  const lang = await getServerLang();
  const t = techStackT[lang];

  return (
    <section className="relative py-16 px-4 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="text-sm text-white/30 uppercase tracking-widest mb-1">
            {t.label}
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-white/70">
            {t.heading}
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {t.techs.map((tech, idx) => (
            <div
              key={idx}
              className="glass-dark p-6 text-center group hover:border-white/15 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-2xl font-bold neon-text mb-1">
                {tech.name}
              </div>
              <div className="text-sm font-medium text-white/60 mb-2">
                {tech.subtitle}
              </div>
              <div className="text-xs text-white/30">{tech.description}</div>
            </div>
          ))}
        </div>

        <p
          className="text-center text-xs text-white/25 mt-8 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          {t.footer}
        </p>
      </div>
    </section>
  );
}
