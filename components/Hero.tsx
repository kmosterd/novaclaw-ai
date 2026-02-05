"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Bot, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
  const [formData, setFormData] = useState({ email: "", name: "", company: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, source: "hero_form" }) });
      if (!response.ok) throw new Error("Failed");
      setIsSubmitted(true);
    } catch (err) { setError("Er ging iets mis. Probeer opnieuw."); }
    finally { setIsSubmitting(false); }
  };

  const features = [
    { icon: Bot, text: "Custom AI Agents" },
    { icon: Zap, text: "Volledig Beheerd" },
    { icon: Sparkles, text: "Veilig & Op Maat" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div className="max-w-6xl mx-auto text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" /></span>
            <span className="text-white/80">Powered by Autonomous Intelligence</span>
          </span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
          <span className="block text-white">Wij Bouwen</span>
          <span className="block neon-text animate-glow">Jouw AI Agents</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10">
          Custom AI marketing agents die 24/7 content creëren, trends analyseren en publiceren—veilig en volledig op maat voor jouw bedrijf.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 px-4 py-2 glass-dark rounded-full">
              <feature.icon className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-white/80">{feature.text}</span>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-md mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="glass p-6 space-y-4">
                <input type="text" placeholder="Je naam" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="glass-input" required />
                <input type="email" placeholder="E-mailadres" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="glass-input" required />
                <input type="text" placeholder="Bedrijf (optioneel)" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="glass-input" />
                <button type="submit" disabled={isSubmitting} className={cn("w-full py-4 px-6 rounded-xl font-semibold text-lg bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2", isSubmitting && "opacity-70")}>
                  {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" />Even geduld...</> : <>Plan een Gratis Gesprek<ArrowRight className="w-5 h-5" /></>}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </div>
            </form>
          ) : (
            <div className="glass p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-neon-green" /></div>
              <h3 className="text-2xl font-bold mb-2">Bedankt!</h3>
              <p className="text-white/60">We nemen binnen 24 uur contact met je op.</p>
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
          <span>✓ Gratis kennismaking</span>
          <span>✓ Geen verplichtingen</span>
          <span>✓ Antwoord binnen 24 uur</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
