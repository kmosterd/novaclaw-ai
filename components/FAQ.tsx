"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Wat zijn AI agents en wat kunnen ze voor mijn bedrijf doen?",
    a: "AI agents zijn autonome software-assistenten die specifieke taken uitvoeren voor jouw bedrijf. Denk aan het automatisch genereren van social media content, het beantwoorden van klantvragen, het analyseren van markttrends, of het opvolgen van leads. Ze werken 24/7, maken geen fouten door vermoeidheid, en schalen mee met je bedrijf."
  },
  {
    q: "Moet ik technische kennis hebben om met NovaClaw te werken?",
    a: "Nee, helemaal niet. NovaClaw is een full-service agency. Wij bouwen, configureren en beheren alles voor je. Jij vertelt ons wat je wilt bereiken, en wij zorgen dat de AI agents dat realiseren. Je hoeft zelf geen code te schrijven of technische beslissingen te nemen."
  },
  {
    q: "Hoe lang duurt het voordat mijn AI agents live gaan?",
    a: "Na het kennismakingsgesprek bouwen wij jouw custom agents binnen 1-2 weken. We testen uitgebreid voordat we live gaan. Daarna optimaliseren we wekelijks of dagelijks, afhankelijk van je pakket."
  },
  {
    q: "Wat kost het en kan ik maandelijks opzeggen?",
    a: "Onze pakketten starten vanaf \u20ac497 per maand voor 1 custom AI agent. Het Growth-pakket (\u20ac997/maand) is het meest gekozen en bevat 3 agents met onbeperkte acties. Alle pakketten zijn maandelijks opzegbaar, geen lange contracten."
  },
  {
    q: "Zijn mijn gegevens veilig bij NovaClaw?",
    a: "Absoluut. We zijn volledig GDPR-compliant en verwerken alle data binnen de EU. We gebruiken enterprise-grade beveiliging met encryptie. Jouw data wordt nooit gedeeld met derden en je behoudt altijd volledige eigendom over je content en gegevens."
  },
  {
    q: "Welke AI agents bieden jullie aan?",
    a: "Wij bieden meer dan 18 typen AI agents in 4 categorieen. Klant & Communicatie: Klantenservice Agent, Voice Agent, Chatbot Agent en Helpdesk Agent. Marketing & Content: Content Agent, SEO & AIO Agent, Email Marketing Agent, Social Media Agent en Ads & Campaign Agent. Sales & Leadgeneratie: Lead Generation Agent, Appointment Setter Agent en E-commerce Agent. Data & Operations: Automation Agent, Data & Analytics Agent, Data Entry Agent, Compliance Agent, Web Scraping Agent en Custom AI Agent. Heb je een uniek probleem? Wij bouwen elke agent die je kunt bedenken."
  },
  {
    q: "Welke AI-technologie gebruiken jullie?",
    a: "Wij zijn tech-agnostisch en werken met de beste AI-modellen: OpenAI (GPT-4o), Anthropic Claude, Google Gemini en Meta Llama. Per project kiezen wij de technologie die de beste resultaten levert voor jouw specifieke use case. Je bent dus nooit gebonden aan een leverancier."
  },
  {
    q: "Welke platforms ondersteunen jullie?",
    a: "We integreren met alle gangbare platforms: LinkedIn, Instagram, Twitter/X, Facebook, je website, email marketing tools, CRM-systemen en meer. Bij het Enterprise-pakket bouwen we ook custom integraties voor specifieke software die je gebruikt."
  },
  {
    q: "Wat is het verschil tussen NovaClaw en een chatbot zoals ChatGPT?",
    a: "ChatGPT is een generieke AI-tool die jij zelf moet aansturen. NovaClaw bouwt gespecialiseerde AI agents die autonoom taken uitvoeren, specifiek getraind op jouw merk, doelgroep en doelen. Bovendien werken wij niet met een enkel AI-model maar kiezen per taak het beste model (OpenAI, Claude, Gemini). Het verschil is als een universeel zakmes versus een compleet op maat gemaakt professioneel gereedschap."
  },
  {
    q: "Hoe kan ik contact opnemen met NovaClaw?",
    a: "Je kunt direct een gratis kennismakingsgesprek inplannen via het formulier bovenaan deze pagina. Je kunt ook mailen naar info@novaclaw.tech. We reageren altijd binnen 24 uur op werkdagen."
  },
  {
    q: "Kan ik de AI agents eerst uitproberen?",
    a: "Ja! We bieden een gratis kennismakingsgesprek aan waarin we jouw situatie bespreken en een concreet voorstel doen. Je ziet precies wat de agents voor jou gaan doen voordat je beslist. Bovendien is alles maandelijks opzegbaar, dus je zit nergens aan vast."
  },
  {
    q: "Voor welke bedrijven is NovaClaw geschikt?",
    a: "NovaClaw is geschikt voor elk bedrijf dat wil groeien met AI: van startups en MKB tot grote organisaties. We werken met e-commerce bedrijven, marketingbureaus, IT-bedrijven, financiele dienstverleners, gezondheidszorg en meer. Als je repetitieve taken hebt die je wilt automatiseren, kunnen wij helpen."
  },
];

// FAQ JSON-LD schema for AI search engines
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* JSON-LD for AIO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="text-center mb-16">
        <p className="text-neon-cyan text-sm font-semibold tracking-widest uppercase mb-3">
          Veelgestelde Vragen
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Alles wat je wilt weten
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="glass-dark rounded-xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
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
