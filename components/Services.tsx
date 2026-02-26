import {
  MessageSquareMore,
  FileText,
  Search,
  Mail,
  Share2,
  Workflow,
  ShoppingCart,
  Users,
  BarChart3,
  Bot,
  Phone,
  Globe,
  Shield,
  CalendarCheck,
  BrainCircuit,
  Megaphone,
  Database,
  Headphones,
} from "lucide-react";
import { getServerLang } from "@/lib/i18n";
import { servicesT } from "@/lib/translations";

// Icon mapping — same order as agents in each category
const iconMap = [
  // Klant & Communicatie
  [MessageSquareMore, Phone, Bot, Headphones],
  // Marketing & Content
  [FileText, Search, Mail, Share2, Megaphone],
  // Sales & Leadgeneratie
  [Users, CalendarCheck, ShoppingCart],
  // Data & Operations
  [Workflow, BarChart3, Database, Shield, Globe, BrainCircuit],
];

const colors = ["neon-cyan", "neon-purple", "neon-magenta"];

export default async function Services() {
  const lang = await getServerLang();
  const t = servicesT[lang];

  // Flatten all agents for count and JSON-LD
  const allAgents = t.categories.flatMap((cat) => cat.agents);

  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.jsonLdName,
    description: t.jsonLdDescription,
    numberOfItems: allAgents.length,
    itemListElement: allAgents.map((agent, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: agent.title,
        description: agent.description,
        provider: {
          "@type": "Organization",
          name: "NovaClaw AI",
          url: "https://novaclaw.tech",
        },
      },
    })),
  };

  return (
    <section
      id="diensten"
      className="relative py-24 px-4 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="text-neon-cyan text-sm font-semibold tracking-widest uppercase">
            {t.sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {t.heading(allAgents.length)}
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            {t.subheading}
          </p>
        </div>

        {t.categories.map((category, catIdx) => (
          <div key={catIdx} className="mb-20">
            <div className="mb-8 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-2">
                {category.category}
              </h3>
              <p className="text-white/40 text-sm">{category.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {category.agents.map((agent, idx) => {
                const color = colors[(catIdx + idx) % colors.length];
                const Icon = iconMap[catIdx]?.[idx] || BrainCircuit;
                const globalIdx = catIdx * 10 + idx;

                return (
                  <div
                    key={globalIdx}
                    className="glass group hover:border-white/20 transition-all duration-300 p-6 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon
                        className="w-6 h-6 text-neon-cyan"
                        strokeWidth={1.5}
                      />
                    </div>

                    <h4 className="text-lg font-bold mb-2 text-white">
                      {agent.title}
                    </h4>

                    <p className="text-white/50 text-sm leading-relaxed mb-4">
                      {agent.description}
                    </p>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
                      <span className="text-xs font-medium text-neon-cyan">
                        {agent.stats}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="text-center mt-8 animate-fade-in-up">
          <div className="glass-dark rounded-2xl p-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">
              {t.ctaTitle}
            </h3>
            <p className="text-white/50 mb-6">{t.ctaText}</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
            >
              {t.ctaButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
