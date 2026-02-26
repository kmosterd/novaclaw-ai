import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getServerLang } from "@/lib/i18n";
import { pricingT } from "@/lib/translations";

export default async function Pricing() {
  const lang = await getServerLang();
  const t = pricingT[lang];

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-magenta text-sm font-semibold uppercase">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {t.heading}
          </h2>
          <p className="text-xl text-white/60">{t.subheading}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {t.plans.map((plan, idx) => {
            const isPopular = idx === 1;
            return (
              <div
                key={idx}
                className={cn(
                  "relative glass p-8 flex flex-col animate-fade-in-up",
                  isPopular && "border-neon-cyan/50 scale-105"
                )}
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-1 rounded-full text-sm font-semibold">
                      {t.popularBadge}
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">
                      {plan.price === "Op maat" || plan.price === "Custom"
                        ? ""
                        : "\u20ac"}
                      {plan.price}
                    </span>
                    <span className="text-white/40">{plan.period}</span>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-neon-green shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#contact"
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90",
                    isPopular
                      ? "bg-gradient-to-r from-neon-cyan to-neon-magenta"
                      : "glass-dark"
                  )}
                >
                  {t.ctaButton}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        <div
          className="mt-12 text-center animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <p className="text-sm text-white/40 mb-3">{t.agentTypesLabel}</p>
          <div className="flex flex-wrap justify-center gap-2">
            {t.agentTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1.5 rounded-full text-xs font-medium glass-dark text-white/60 border border-white/10"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
