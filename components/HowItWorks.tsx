"use client";
import { motion } from "framer-motion";
import { MessageSquare, Cpu, Rocket } from "lucide-react";
export default function HowItWorks() {
  const steps = [
    { icon: MessageSquare, step: "01", title: "Kennismakingsgesprek", description: "We bespreken jouw doelen, doelgroep en contentbehoeften." },
    { icon: Cpu, step: "02", title: "Wij Bouwen Jouw Agents", description: "Ons team configureert custom AI agents op maat." },
    { icon: Rocket, step: "03", title: "Launch & Beheer", description: "Je agents gaan live! Wij monitoren en optimaliseren." },
  ];
  return (
    <section className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-neon-cyan text-sm font-semibold uppercase">Ons Proces</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Hoe Het Werkt</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center"><step.icon className="w-7 h-7 text-neon-cyan" /></div>
                <span className="text-4xl font-bold text-white/20">{step.step}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-white/60">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
