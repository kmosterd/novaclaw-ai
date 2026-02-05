"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const plans = [
    { name: "Starter", price: "497", period: "/maand", description: "Perfect om te starten", features: ["1 Custom AI Agent", "1 Platform", "Tot 20 posts/maand", "Email support"], popular: false },
    { name: "Growth", price: "997", period: "/maand", description: "Voor bedrijven die willen opschalen", features: ["3 Custom AI Agents", "Alle platforms", "Onbeperkte content", "Priority support", "A/B testing"], popular: true },
    { name: "Enterprise", price: "Op maat", period: "", description: "Voor grote organisaties", features: ["Onbeperkte AI Agents", "Custom integraties", "Dedicated manager", "24/7 support"], popular: false },
  ];

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-neon-magenta text-sm font-semibold uppercase">Transparante Prijzen</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Kies Jouw Plan</h2>
          <p className="text-xl text-white/60">Geen verrassingen. Maandelijks opzegbaar.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={cn("relative glass p-8 flex flex-col", plan.popular && "border-neon-cyan/50 scale-105")}>
              {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-gradient-to-r from-neon-cyan to-neon-purple px-4 py-1 rounded-full text-sm font-semibold">Meest Gekozen</span></div>}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price.startsWith("Op") ? "" : "€"}{plan.price}</span>
                  <span className="text-white/40">{plan.period}</span>
                </div>
                <p className="text-white/60 text-sm mt-2">{plan.description}</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-3"><Check className="w-5 h-5 text-neon-green shrink-0" /><span className="text-white/80 text-sm">{feature}</span></li>
                ))}
              </ul>
              <button className={cn("w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2", plan.popular ? "bg-gradient-to-r from-neon-cyan to-neon-magenta" : "glass-dark")}>Start Gesprek<ArrowRight className="w-4 h-4" /></button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
