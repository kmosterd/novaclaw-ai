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

interface AgentCategory {
  category: string;
  description: string;
  agents: Agent[];
}

interface Agent {
  icon: React.ElementType;
  title: string;
  description: string;
  stats: string;
}

const agentCategories: AgentCategory[] = [
  {
    category: "Klant & Communicatie",
    description:
      "Agents die klantcontact automatiseren en je bereikbaarheid verbeteren",
    agents: [
      {
        icon: MessageSquareMore,
        title: "Klantenservice Agent",
        description:
          "Automatisch klantberichten beantwoorden via email, chat, Slack of WhatsApp. Triageert op urgentie en escaleert complexe vragen naar een mens.",
        stats: "90% snellere reactietijd",
      },
      {
        icon: Phone,
        title: "Voice Agent",
        description:
          "AI-gestuurd bellen en gespreksafhandeling. Inbound calls beantwoorden, outbound bellen voor afspraken en follow-ups. Menselijke spraakkwaliteit.",
        stats: "24/7 telefonisch bereikbaar",
      },
      {
        icon: Bot,
        title: "Chatbot Agent",
        description:
          "Intelligente chatbot voor je website of app. Beantwoordt vragen, plant afspraken, kwalificeert leads en verwijst door — getraind op jouw bedrijf.",
        stats: "80% vragen direct opgelost",
      },
      {
        icon: Headphones,
        title: "Helpdesk Agent",
        description:
          "Interne support automatiseren. Ticketsysteem beheren, FAQ beantwoorden voor medewerkers, IT-vragen triageren en kennisbank doorzoeken.",
        stats: "60% minder tickets",
      },
    ],
  },
  {
    category: "Marketing & Content",
    description:
      "Agents die je marketing automatiseren en content op schaal produceren",
    agents: [
      {
        icon: FileText,
        title: "Content Agent",
        description:
          "Van 1 stuk content naar 10+ platformen. Blogposts, social media posts, nieuwsbrief en meer — allemaal in jouw tone of voice.",
        stats: "300% meer content output",
      },
      {
        icon: Search,
        title: "SEO & AIO Agent",
        description:
          "Content die rankt bij Google en AI-zoekmachines (ChatGPT, Gemini, Perplexity). Keyword research, content gaps en technische SEO.",
        stats: "Gevonden door mens en AI",
      },
      {
        icon: Mail,
        title: "Email Marketing Agent",
        description:
          "Welkomstflows, sales funnels, nieuwsbrieven en re-engagement campagnes. A/B testing op onderwerpregels. Hogere open rates.",
        stats: "Tot 53% hogere conversie",
      },
      {
        icon: Share2,
        title: "Social Media Agent",
        description:
          "Posts maken, reacties beheren, engagement analyseren op LinkedIn, Instagram en X. Virale trend-detectie en concurrentie-analyse.",
        stats: "34% meer engagement",
      },
      {
        icon: Megaphone,
        title: "Ads & Campaign Agent",
        description:
          "Google Ads, Meta Ads en LinkedIn Ads campagnes optimaliseren. Biedstrategieën aanpassen, budgetten herverdelen en rapporteren op ROI.",
        stats: "Lagere CPA, hoger ROAS",
      },
    ],
  },
  {
    category: "Sales & Leadgeneratie",
    description:
      "Agents die je salesproces versnellen en leads omzetten in klanten",
    agents: [
      {
        icon: Users,
        title: "Lead Generation Agent",
        description:
          "Automatisch leads vinden, kwalificeren en opvolgen. Scrape prospects, verrijk met data, en stuur persoonlijke outreach via email of LinkedIn.",
        stats: "3x meer gekwalificeerde leads",
      },
      {
        icon: CalendarCheck,
        title: "Appointment Setter Agent",
        description:
          "Automatisch afspraken inplannen met prospects. Follow-up sequences, reminders en no-show opvolging. Integreert met je agenda.",
        stats: "2x meer geboekte calls",
      },
      {
        icon: ShoppingCart,
        title: "E-commerce Agent",
        description:
          "Productbeschrijvingen genereren, prijzen monitoren, voorraad beheren en abandoned cart follow-ups. Upsell en cross-sell automatiseren.",
        stats: "28% hogere orderwaarde",
      },
    ],
  },
  {
    category: "Data & Operations",
    description:
      "Agents die je bedrijfsprocessen automatiseren en inzichten leveren",
    agents: [
      {
        icon: Workflow,
        title: "Automation Agent",
        description:
          "Workflows automatiseren tussen al je systemen. CRM, boekhouding, projectmanagement, e-commerce — alles gekoppeld.",
        stats: "12+ uur per week bespaard",
      },
      {
        icon: BarChart3,
        title: "Data & Analytics Agent",
        description:
          "Automatisch rapporten genereren, KPI-dashboards vullen, trends detecteren en anomalieën signaleren. Van ruwe data naar bruikbare inzichten.",
        stats: "Realtime business intelligence",
      },
      {
        icon: Database,
        title: "Data Entry & Processing Agent",
        description:
          "Documenten verwerken, facturen inlezen, formulieren digitaliseren, data invoeren en valideren. Van PDF naar database in seconden.",
        stats: "95% minder handmatig werk",
      },
      {
        icon: Shield,
        title: "Compliance & Monitoring Agent",
        description:
          "GDPR-compliance monitoren, datakwaliteit controleren, beveiligingsrisico's signaleren en audits voorbereiden. Altijd up-to-date.",
        stats: "Continue compliance monitoring",
      },
      {
        icon: Globe,
        title: "Web Scraping & Research Agent",
        description:
          "Concurrenten monitoren, marktdata verzamelen, prijzen vergelijken, reviews analyseren en trends signaleren. Geautomatiseerd marktonderzoek.",
        stats: "24/7 marktinzichten",
      },
      {
        icon: BrainCircuit,
        title: "Custom AI Agent",
        description:
          "Heb je een uniek probleem? Wij bouwen een agent op maat. Van intern kennisbeheer tot specifieke industrie-workflows. Alles is mogelijk.",
        stats: "100% op maat gebouwd",
      },
    ],
  },
];

// Flatten all agents for JSON-LD
const allAgents = agentCategories.flatMap((cat) => cat.agents);

// JSON-LD for services (Service schema for AIO/GEO)
const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Agent Diensten van NovaClaw",
  description:
    "Custom AI agents voor bedrijven: klantenservice, voice, content, SEO, email marketing, social media, leadgeneratie, e-commerce, data analytics, workflow automation en meer.",
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

// Color cycling for visual variety
const colors = ["neon-cyan", "neon-purple", "neon-magenta"];

export default function Services() {
  return (
    <section
      id="diensten"
      className="relative py-24 px-4 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent"
    >
      {/* JSON-LD for AIO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <span className="text-neon-cyan text-sm font-semibold tracking-widest uppercase">
            Onze AI Agents
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Meer Dan {allAgents.length} Agent-Types. Eindeloze Mogelijkheden.
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Van klantenservice tot data-analyse, van leadgeneratie tot compliance
            monitoring. Wij bouwen elke AI agent die jouw bedrijf nodig heeft —
            op maat, met de beste technologie.
          </p>
        </div>

        {/* Category sections */}
        {agentCategories.map((category, catIdx) => (
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
                const globalIdx = catIdx * 10 + idx;

                return (
                  <div
                    key={globalIdx}
                    className="glass group hover:border-white/20 transition-all duration-300 p-6 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <agent.icon
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

        {/* CTA under services */}
        <div className="text-center mt-8 animate-fade-in-up">
          <div className="glass-dark rounded-2xl p-10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">
              Jouw agent staat er niet tussen?
            </h3>
            <p className="text-white/50 mb-6">
              Geen probleem. Wij bouwen elke AI agent die je kunt bedenken. Vertel
              ons je uitdaging en wij maken het.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
            >
              Gratis Adviesgesprek Inplannen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
