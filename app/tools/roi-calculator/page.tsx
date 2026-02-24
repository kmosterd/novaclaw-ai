import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CalculatorForm from "@/components/roi-calculator/CalculatorForm";

export const metadata: Metadata = {
  title: "Gratis AI Agent ROI Calculator | NovaClaw AI",
  description:
    "Bereken hoeveel je bespaart met AI agents. Selecteer je agents, vul je gegevens in en ontdek je maandelijkse besparing, terugverdientijd en het ideale plan.",
  alternates: {
    canonical: "https://novaclaw.tech/tools/roi-calculator",
  },
  openGraph: {
    title: "AI Agent ROI Calculator — Bereken Je Besparing",
    description:
      "Hoeveel bespaar je met AI agents? Bereken het gratis in 2 minuten. Gepersonaliseerd voor jouw bedrijf.",
    url: "https://novaclaw.tech/tools/roi-calculator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Agent ROI Calculator",
    description:
      "Bereken gratis hoeveel je bespaart met custom AI agents.",
  },
};

const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AI Agent ROI Calculator",
  url: "https://novaclaw.tech/tools/roi-calculator",
  description:
    "Calculate your business savings with AI agents. Free interactive ROI calculator by NovaClaw AI.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
  provider: {
    "@type": "Organization",
    name: "NovaClaw AI",
    url: "https://novaclaw.tech",
  },
  inLanguage: ["nl", "en"],
};

export default function RoiCalculatorPage() {
  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft size={16} /> Terug naar home
          </Link>
        </div>

        <CalculatorForm />

        {/* Bottom CTA */}
        <div className="mt-16 glass-dark rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Klaar om te starten met AI agents?
          </h3>
          <p className="text-sm text-white/50 mb-6 max-w-lg mx-auto">
            Plan een gratis kennismakingsgesprek en ontdek wat NovaClaw voor
            jouw bedrijf kan betekenen. Binnen 1-2 weken live.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            Plan Gratis Gesprek &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
