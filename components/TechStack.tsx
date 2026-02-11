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
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="text-sm text-white/30 uppercase tracking-widest mb-1">
            Technologie-Agnostisch
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-white/70">
            Wij kiezen per project de optimale AI-technologie
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {technologies.map((tech, idx) => (
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

        <p className="text-center text-xs text-white/25 mt-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          Wij zijn niet gebonden aan een leverancier. Voor elk project
          selecteren wij het AI-model dat de beste resultaten levert voor
          jouw specifieke use case. Van GPT-4o voor complexe redeneertaken
          tot Gemini voor multimodale analyse.
        </p>
      </div>
    </section>
  );
}
