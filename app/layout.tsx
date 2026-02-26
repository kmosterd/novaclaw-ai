import type { Metadata } from "next";
import "./globals.css";
import { getServerLang } from "@/lib/i18n";
import { LangProvider } from "@/components/LangProvider";
import { layoutT } from "@/lib/translations";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getServerLang();
  const t = layoutT[lang];

  return {
    metadataBase: new URL("https://novaclaw.tech"),
    title: {
      default: t.title,
      template: "%s | NovaClaw AI",
    },
    description: t.description,
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
      languages: {
        "nl-NL": "https://novaclaw.tech",
        en: "https://novaclaw.tech",
      },
    },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      url: "https://novaclaw.tech",
      siteName: "NovaClaw AI",
      locale: lang === "nl" ? "nl_NL" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "NovaClaw AI | Custom AI Agents",
      description: t.twitterDescription,
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
}

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getServerLang();

  return (
    <html lang={lang} className="dark">
      <head>
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-4WMTVF45XS"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-4WMTVF45XS');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <link
          rel="alternate"
          hrefLang="nl"
          href="https://novaclaw.tech"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://novaclaw.tech"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://novaclaw.tech"
        />
      </head>
      <body className="antialiased min-h-screen overflow-x-hidden">
        <LangProvider initialLang={lang}>
          <div className="relative">{children}</div>
        </LangProvider>
      </body>
    </html>
  );
}
