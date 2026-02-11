"use client";

import { motion } from "framer-motion";
import {
  MessageSquareMore,
  FileText,
  Search,
  Mail,
  Share2,
  Workflow,
} from "lucide-react";

const services = [
  {
    icon: MessageSquareMore,
    title: "Klantenservice Agent",
    description:
      "Automatisch klantberichten beantwoorden, triageren op urgentie en opvolgen. Reactietijd van 30 minuten naar 3 minuten. 24/7 beschikbaar, nooit ziek.",
    stats: "90% snellere reactietijd",
    color: "neon-cyan",
  },
  {
    icon: FileText,
    title: "Content Agent",
    description:
      "Van 1 stuk content naar 10+ platformen. Blogpost, social media posts, nieuwsbrief en meer — allemaal in jouw tone of voice en automatisch verspreid.",
    stats: "300% meer content output",
    color: "neon-purple",
  },
  {
    icon: Search,
    title: "SEO & AIO Agent",
    description:
      "Geoptimaliseerde content die rankt bij Google en AI-zoekmachines zoals ChatGPT, Gemini en Perplexity. Keyword research, content gaps en technische SEO — volledig geautomatiseerd.",
    stats: "Gevonden door mens en AI",
    color: "neon-magenta",
  },
  {
    icon: Mail,
    title: "Email Marketing Agent",
    description:
      "Welkomstflows, sales funnels, nieuwsbrieven en re-engagement campagnes. A/B testing van onderwerpregels. Hogere open rates en meer conversies op automatische piloot.",
    stats: "Tot 53% hogere conversie",
    color: "neon-cyan",
  },
  {
    icon: Share2,
    title: "Social Media Agent",
    description:
      "Posts maken, reacties beheren, engagement analyseren en groeien op LinkedIn, Instagram en X. Inclusief concurrentie-analyse en virale trend-detectie.",
    stats: "Gemiddeld 34% meer engagement",
    color: "neon-purple",
  },
  {
    icon: Workflow,
    title: "Automation Agent",
    description:
      "Workflows automatiseren tussen al je systemen. CRM, boekhouding, projectmanagement, e-commerce — wij koppelen alles en laten AI het zware werk doen.",
    stats: "12+ uur per week bespaard",
    color: "neon-magenta",
  },
];

// JSON-LD for services (Service schema for AIO/GEO)
const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Agent Diensten van NovaClaw",
  description:
    "Custom AI agents voor Nederlandse bedrijven: klantenservice, content, SEO, email marketing, social media en workflow automation.",
  numberOfItems: services.length,
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Service",
      name: service.title,
      description: service.description,
      provider: {
        "@type": "Organization",
        name: "NovaClaw AI",
        url: "https://novaclaw.tech",
      },
    },
  })),
};

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

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-cyan text-sm font-semibold tracking-widest uppercase">
            Onze AI Agents
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Welke Agent Past Bij Jouw Bedrijf?
          </h2>
          <p className="text-xl text-white/60 max-w-3xl mx-auto">
            Wij bouwen gespecialiseerde AI agents die specifieke taken overnemen.
            Elk type agent wordt op maat gemaakt voor jouw merk, doelgroep en
            doelen.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass group hover:border-white/20 transition-all duration-300 p-8"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-${service.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon
                  className={`w-7 h-7 text-${service.color}`}
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="text-xl font-bold mb-3 text-white">
                {service.title}
              </h3>

              <p className="text-white/50 text-sm leading-relaxed mb-4">
                {service.description}
              </p>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-${service.color}/10 border border-${service.color}/20`}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-${service.color} animate-pulse`}
                />
                <span className={`text-xs font-medium text-${service.color}`}>
                  {service.stats}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA under services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-white/50 mb-6">
            Niet zeker welke agent je nodig hebt? Wij adviseren je graag.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            Gratis Adviesgesprek Inplannen
          </a>
        </motion.div>
      </div>
    </section>
  );
}
