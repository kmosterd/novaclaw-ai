import { MessageSquare, Cpu, Rocket } from "lucide-react";
import { getServerLang } from "@/lib/i18n";
import { howItWorksT } from "@/lib/translations";

const stepIcons = [MessageSquare, Cpu, Rocket];

export default async function HowItWorks() {
  const lang = await getServerLang();
  const t = howItWorksT[lang];

  const steps = t.steps.map((step, idx) => ({
    icon: stepIcons[idx],
    step: `0${idx + 1}`,
    ...step,
  }));

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-cyan text-sm font-semibold uppercase">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {t.heading}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass p-8 animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-neon-cyan" />
                </div>
                <span className="text-4xl font-bold text-white/20">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-white/60">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
