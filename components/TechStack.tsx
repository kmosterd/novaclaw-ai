"use client";

import { motion } from "framer-motion";

const technologies = [
  {
    name: "OpenAI",
    subtitle: "GPT-4o",
    description: "Geavanceerde taalmodellen",
  },
  {
    name: "Anthropic",
    subtitle: "Claude",
    description: "Veilige AI-assistenten",
  },
  {
    name: "Google",
    subtitle: "Gemini",
    description: "Multimodale AI",
  },
  {
    name: "Meta",
    subtitle: "Llama",
    description: "Open-source modellen",
  },
];

export default function TechStack() {
  return (
    <section className="relative py-16 px-4 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm text-white/30 uppercase tracking-widest mb-1">
            Technologie-Agnostisch
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-white/70">
            Wij kiezen per project de optimale AI-technologie
          </h3>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {technologies.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-dark p-6 text-center group hover:border-white/15 transition-all duration-300"
            >
              <div className="text-2xl font-bold neon-text mb-1">
                {tech.name}
              </div>
              <div className="text-sm font-medium text-white/60 mb-2">
                {tech.subtitle}
              </div>
              <div className="text-xs text-white/30">{tech.description}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs text-white/25 mt-8 max-w-2xl mx-auto"
        >
          Wij zijn niet gebonden aan een leverancier. Voor elk project
          selecteren wij het AI-model dat de beste resultaten levert voor
          jouw specifieke use case. Van GPT-4o voor complexe redeneertaken
          tot Gemini voor multimodale analyse.
        </motion.p>
      </div>
    </section>
  );
}
