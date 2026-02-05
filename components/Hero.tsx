"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Bot, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadFormData {
  email: string;
  name: string;
  company: string;
}

export default function Hero() {
  const [formData, setFormData] = useState<LeadFormData>({
    email: "",
    name: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "hero_form",
          metadata: {
            page: "homepage",
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const features = [
    { icon: Bot, text: "Autonomous AI Agents" },
    { icon: Zap, text: "24/7 Content Generation" },
    { icon: Sparkles, text: "Zero Human Intervention" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        className="max-w-6xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
            </span>
            <span className="text-white/80">Powered by Autonomous Intelligence</span>
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
        >
          <span className="block text-white">Your Marketing</span>
          <span className="block neon-text animate-glow">Runs Itself</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-10"
        >
          Deploy autonomous AI agents that research trends, create content,
          and distribute across platforms—while you sleep.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 glass-dark rounded-full"
            >
              <feature.icon className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-white/80">{feature.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Lead Capture Form */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="glass p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-input"
                  required
                />
                <input
                  type="text"
                  placeholder="Company (Optional)"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="glass-input"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-4 px-6 rounded-xl font-semibold text-lg",
                    "bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta",
                    "hover:shadow-neon-cyan transition-all duration-300",
                    "flex items-center justify-center gap-2",
                    "disabled:opacity-70 disabled:cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Get Early Access
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-2xl font-bold mb-2">You're In!</h3>
              <p className="text-white/60">
                Our AI agents are now preparing your personalized onboarding sequence.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-wrap justify-center gap-8 text-white/40 text-sm"
        >
          <span>✓ No credit card required</span>
          <span>✓ Setup in 5 minutes</span>
          <span>✓ Cancel anytime</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
