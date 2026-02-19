import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://novaclaw.tech"),
  title: {
    default: "NovaClaw AI | Custom AI Agents voor Bedrijven in Nederland",
    template: "%s | NovaClaw AI",
  },
  description:
    "NovaClaw is een Nederlands bureau dat 18+ typen custom AI-agents bouwt voor bedrijven. Van klantenservice en voice agents tot lead generation, content automation, SEO & AIO, e-commerce en data analytics agents. Powered by OpenAI, Claude, Gemini. GDPR-compliant, 100% op maat.",
  keywords: [
    "AI agents",
    "AI agency Nederland",
    "custom AI agents",
    "klantenservice AI agent",
    "voice agent",
    "chatbot agent",
    "helpdesk AI",
    "content automatisering",
    "SEO AI agent",
    "AIO optimalisatie",
    "email marketing AI",
    "social media AI agent",
    "ads campaign agent",
    "lead generation AI agent",
    "appointment setter AI",
    "e-commerce AI agent",
    "workflow automation AI",
    "data analytics AI",
    "data entry automation",
    "compliance monitoring AI",
    "web scraping agent",
    "AI bureau",
    "marketing automation",
    "AI chatbot",
    "NovaClaw",
    "OpenAI",
    "Claude AI",
    "Gemini AI",
  ],
  authors: [{ name: "NovaClaw AI", url: "https://novaclaw.tech" }],
  creator: "NovaClaw AI",
  publisher: "NovaClaw AI",
  alternates: {
    canonical: "https://novaclaw.tech",
    languages: { "nl-NL": "https://novaclaw.tech" },
  },
  openGraph: {
    title: "NovaClaw AI | Custom AI Agents voor Bedrijven",
    description:
      "Nederlands bureau dat 18+ typen custom AI-agents bouwt: klantenservice, voice, content, SEO, lead generation, e-commerce, data analytics en meer. Powered by OpenAI, Claude & Gemini.",
    url: "https://novaclaw.tech",
    siteName: "NovaClaw AI",
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaClaw AI | Custom AI Agents",
    description: "Nederlands bureau voor custom AI agents. Wij bouwen, jij groeit.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "NovaClaw AI",
  url: "https://novaclaw.tech",
  email: "info@novaclaw.tech",
  description:
    "Nederlands bureau dat custom AI-agents bouwt voor bedrijven. Van content automatisering tot lead generatie.",
  foundingDate: "2025",
  areaServed: {
    "@type": "Country",
    name: "Netherlands",
  },
  serviceType: [
    "AI Agent Development",
    "Klantenservice AI Agent",
    "Voice AI Agent",
    "Chatbot Agent",
    "Helpdesk AI Agent",
    "Content AI Agent",
    "SEO & AIO Agent",
    "Email Marketing AI Agent",
    "Social Media AI Agent",
    "Ads & Campaign Agent",
    "Lead Generation AI Agent",
    "Appointment Setter Agent",
    "E-commerce AI Agent",
    "Workflow Automation Agent",
    "Data Analytics AI Agent",
    "Data Entry & Processing Agent",
    "Compliance & Monitoring Agent",
    "Web Scraping & Research Agent",
    "Custom AI Agent Development",
  ],
  knowsAbout: [
    "OpenAI GPT-4o",
    "Anthropic Claude",
    "Google Gemini",
    "Meta Llama",
    "AI Agents",
    "Marketing Automation",
    "AIO Optimalisatie",
    "Voice AI",
    "Lead Generation",
    "Data Analytics",
    "E-commerce Automation",
    "Compliance Monitoring",
  ],
  knowsLanguage: ["nl", "en"],
  slogan: "Wij bouwen, jij groeit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        <div className="relative">
          {/* Background — static gradients baked into body, no blur needed */}
          {children}
        </div>
      </body>
    </html>
  );
}
