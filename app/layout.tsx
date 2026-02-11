import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://novaclaw.tech"),
  title: {
    default: "NovaClaw AI | Custom AI Agents voor Bedrijven in Nederland",
    template: "%s | NovaClaw AI",
  },
  description:
    "NovaClaw is een Nederlands bureau dat custom AI-agents bouwt voor bedrijven. Wij bouwen, testen en beheren jouw AI agents. Van content automatisering tot lead generatie. GDPR-compliant, 100% op maat.",
  keywords: [
    "AI agents",
    "AI agency Nederland",
    "custom AI agents",
    "marketing automation",
    "AI automatisering",
    "AI bureau",
    "content automatisering",
    "AI chatbot",
    "lead generatie AI",
    "NovaClaw",
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
      "Nederlands bureau dat custom AI-agents bouwt. Wij bouwen, jij groeit. GDPR-compliant, maandelijks opzegbaar.",
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
    "Marketing Automation",
    "Content Automation",
    "Lead Generation",
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
          {/* Gradient Orbs Background */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-magenta/10 rounded-full blur-[200px]" />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
