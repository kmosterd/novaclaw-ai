import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "497",
    period: "/maand",
    description: "Perfect om te starten met AI",
    features: [
      "1 Custom AI Agent naar keuze",
      "Keuze uit 18+ agent-types (bijv. Klantenservice, Content, Voice, SEO)",
      "1 Platform integratie",
      "Tot 20 geautomatiseerde acties/maand",
      "Email support",
      "Maandelijkse optimalisatie",
    ],
    popular: false,
  },
  {
    name: "Growth",
    price: "997",
    period: "/maand",
    description: "Voor bedrijven die serieus willen opschalen",
    features: [
      "3 Custom AI Agents naar keuze",
      "Mix & match uit 18+ agent-types",
      "Alle platforms geintegreerd",
      "Onbeperkte acties",
      "Priority support",
      "Wekelijkse optimalisatie",
      "Performance dashboard",
      "A/B testing",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Op maat",
    period: "",
    description: "Voor organisaties met complexe behoeften",
    features: [
      "Onbeperkte AI Agents",
      "Alle 18+ agent-types beschikbaar",
      "Custom integraties & workflows",
      "Dedicated account manager",
      "24/7 support",
      "Dagelijkse optimalisatie",
      "Custom AI model fine-tuning",
      "SLA garantie",
    ],
    popular: false,
  },
];

const agentTypes = [
  "Klantenservice", "Voice", "Chatbot", "Helpdesk", "Content", "SEO & AIO",
  "Email Marketing", "Social Media", "Ads & Campaigns", "Lead Generation",
  "Appointment Setter", "E-commerce", "Automation", "Data & Analytics",
  "Data Entry", "Compliance", "Web Scraping", "Custom Agent",
];

export default function Pricing() {
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-magenta text-sm font-semibold uppercase">
            Transparante Prijzen
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Kies Jouw Plan
          </h2>
          <p className="text-xl text-white/60">
            Geen verrassingen. Maandelijks opzegbaar. Kies je eigen agents.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={cn(
                "relative glass p-8 flex flex-col animate-fade-in-up",
                plan.popular && "border-neon-cyan/50 scale-105"
              )}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-1 rounded-full text-sm font-semibold">
                    Meest Gekozen
                  </span>
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    {plan.price.startsWith("Op") ? "" : "\u20ac"}
                    {plan.price}
                  </span>
                  <span className="text-white/40">{plan.period}</span>
                </div>
                <p className="text-white/60 text-sm mt-2">{plan.description}</p>
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
                  plan.popular
                    ? "bg-gradient-to-r from-neon-cyan to-neon-magenta"
                    : "glass-dark"
                )}
              >
                Start Gesprek
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <p className="text-sm text-white/40 mb-3">
            18+ beschikbare agent-types voor alle pakketten:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {agentTypes.map((type) => (
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
