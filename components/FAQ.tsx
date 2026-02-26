"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLang } from "@/components/LangProvider";
import { faqT } from "@/lib/translations";

export default function FAQ() {
  const { lang } = useLang();
  const t = faqT[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // FAQ JSON-LD schema for AI search engines
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="text-center mb-16">
        <p className="text-neon-cyan text-sm font-semibold tracking-widest uppercase mb-3">
          {t.sectionLabel}
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          {t.heading}
        </h2>
      </div>

      <div className="space-y-3">
        {t.items.map((faq, index) => (
          <div
            key={index}
            className="glass-dark rounded-xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              className="w-full flex items-center justify-between px-6 py-5 text-left"
            >
              <span className="text-sm sm:text-base font-medium text-white/90 pr-4">
                {faq.q}
              </span>
              <ChevronDown
                size={20}
                className={`text-neon-cyan flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96 pb-5" : "max-h-0"
              }`}
            >
              <p className="px-6 text-sm text-white/50 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
