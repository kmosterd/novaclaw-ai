import { TrendingUp, Clock, Zap, Target } from "lucide-react";

const results = [
  {
    icon: Clock,
    metric: "90%",
    label: "Snellere reactietijd",
    detail: "Van 30 min naar 3 min op klantberichten",
  },
  {
    icon: TrendingUp,
    metric: "300%",
    label: "Meer content output",
    detail: "Van 1 stuk content naar 10+ platformen",
  },
  {
    icon: Zap,
    metric: "12+ uur",
    label: "Per week bespaard",
    detail: "Tijd die terugkomt voor je kerntaken",
  },
  {
    icon: Target,
    metric: "53%",
    label: "Hogere conversie",
    detail: "Door slimmere, gepersonaliseerde opvolging",
  },
];

export default function Results() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-magenta text-sm font-semibold tracking-widest uppercase">
            Bewezen Resultaten
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Wat AI Agents Opleveren
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Geen vage beloftes. Dit zijn concrete resultaten die bedrijven behalen
            met custom AI agents.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((result, idx) => (
            <div
              key={idx}
              className="glass-dark p-8 text-center group animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-neon-magenta/10 flex items-center justify-center mx-auto mb-4">
                <result.icon
                  className="w-6 h-6 text-neon-magenta"
                  strokeWidth={1.5}
                />
              </div>

              <div className="text-3xl md:text-4xl font-bold neon-text mb-2">
                {result.metric}
              </div>

              <div className="text-sm font-semibold text-white/80 mb-2">
                {result.label}
              </div>

              <div className="text-xs text-white/40 leading-relaxed">
                {result.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 glass-dark rounded-2xl p-8 md:p-12 text-center animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-3xl mx-auto mb-6">
            &ldquo;Bedrijven die AI agents inzetten besparen gemiddeld{" "}
            <span className="text-neon-cyan font-semibold">12-20 uur per week</span>{" "}
            op repetitieve taken. Die tijd investeren ze in groei, klantrelaties
            en strategie.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple flex items-center justify-center text-sm font-bold">
              NC
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-white/80">
                NovaClaw AI
              </div>
              <div className="text-xs text-white/40">
                Gebaseerd op marktonderzoek 2025-2026
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
