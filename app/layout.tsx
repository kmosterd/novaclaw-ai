import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaClaw AI | Autonomous Marketing Intelligence",
  description: "Million-dollar agency infrastructure powered by autonomous AI agents. Transform your marketing with intelligent automation.",
  keywords: ["AI marketing", "autonomous agents", "marketing automation", "AI agency"],
  authors: [{ name: "NovaClaw AI" }],
  openGraph: {
    title: "NovaClaw AI | Autonomous Marketing Intelligence",
    description: "Transform your marketing with intelligent automation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
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
