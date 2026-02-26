import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getServerLang } from "@/lib/i18n";
import { roiCalcPageT } from "@/lib/translations";
import CalculatorForm from "@/components/roi-calculator/CalculatorForm";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  const t = roiCalcPageT[lang];

  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: "https://novaclaw.tech/tools/roi-calculator",
    },
    openGraph: {
      title: t.title,
      description: t.description,
      url: "https://novaclaw.tech/tools/roi-calculator",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
    },
  };
}

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

export default async function RoiCalculatorPage() {
  const lang = await getServerLang();
  const t = roiCalcPageT[lang];

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
            <ArrowLeft size={16} /> {t.backToHome}
          </Link>
        </div>

        <CalculatorForm />

        {/* Bottom CTA */}
        <div className="mt-16 glass-dark rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            {t.bottomCtaHeading}
          </h3>
          <p className="text-sm text-white/50 mb-6 max-w-lg mx-auto">
            {t.bottomCtaText}
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            {t.bottomCtaButton} &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
