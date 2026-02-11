import Link from "next/link";
import { Mail, Globe, MapPin } from "lucide-react";

const agentTypes = [
  { label: "Klantenservice Agent", href: "/#diensten" },
  { label: "Content Agent", href: "/#diensten" },
  { label: "SEO & AIO Agent", href: "/#diensten" },
  { label: "Email Marketing Agent", href: "/#diensten" },
  { label: "Social Media Agent", href: "/#diensten" },
  { label: "Automation Agent", href: "/#diensten" },
];

const industries = [
  { label: "E-commerce & Retail" },
  { label: "Marketing Bureaus" },
  { label: "IT & Software" },
  { label: "Financiële Diensten" },
  { label: "Gezondheidszorg" },
  { label: "Consultancy" },
  { label: "SaaS Bedrijven" },
];

const resources = [
  { label: "Blog & Kennisbank", href: "/blog" },
  { label: "Veelgestelde Vragen", href: "/#faq" },
  { label: "Hoe het werkt", href: "/#hoe-het-werkt" },
  { label: "Resultaten & ROI", href: "/#resultaten" },
  { label: "Prijzen & Pakketten", href: "/#prijzen" },
];

const blogLinks = [
  { label: "Wat zijn AI Agents?", href: "/blog/wat-zijn-ai-agents" },
  { label: "AIO vs SEO Uitgelegd", href: "/blog/aio-vs-seo-verschil" },
  { label: "6 AI Agents voor MKB", href: "/blog/6-ai-agents-voor-mkb" },
  { label: "What Are AI Agents?", href: "/blog/what-are-ai-agents" },
  { label: "AIO vs SEO Explained", href: "/blog/aio-vs-seo-difference" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer grid — 5 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

          {/* Brand & Contact */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-xl font-bold neon-text mb-3">NovaClaw AI</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              Nederlands bureau dat custom AI-agents bouwt voor bedrijven. Wij bouwen, jij groeit.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <a
                href="mailto:info@novaclaw.tech"
                className="flex items-center gap-2 hover:text-neon-cyan transition-colors"
              >
                <Mail size={14} /> info@novaclaw.tech
              </a>
              <a
                href="https://novaclaw.tech"
                className="flex items-center gap-2 hover:text-neon-cyan transition-colors"
              >
                <Globe size={14} /> novaclaw.tech
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Nederland
              </span>
            </div>
          </div>

          {/* AI Agent Types */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Onze AI Agents
            </h4>
            <ul className="space-y-2">
              {agentTypes.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-neon-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Industrieën
            </h4>
            <ul className="space-y-2">
              {industries.map((item) => (
                <li key={item.label}>
                  <span className="text-sm text-white/40">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-neon-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog Artikelen */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              Blog Artikelen
            </h4>
            <ul className="space-y-2">
              {blogLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/40 hover:text-neon-cyan transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust signals bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <span className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10">
              GDPR Compliant
            </span>
            <span className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10">
              Data Verwerking in EU
            </span>
            <span className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10">
              Maandelijks Opzegbaar
            </span>
            <span className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10">
              100% Op Maat Gebouwd
            </span>
            <span className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10">
              Tech-Agnostisch
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} NovaClaw AI. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/blog" className="text-white/30 hover:text-neon-cyan transition-colors text-xs">
              Blog
            </Link>
            <Link href="/#faq" className="text-white/30 hover:text-neon-cyan transition-colors text-xs">
              FAQ
            </Link>
            <Link href="/#contact" className="text-white/30 hover:text-neon-cyan transition-colors text-xs">
              Contact
            </Link>
            {/* Social placeholders — update when accounts are created */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-neon-cyan transition-colors text-xs"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-neon-cyan transition-colors text-xs"
            >
              Twitter/X
            </a>
          </div>
        </div>

        {/* KvK placeholder */}
        {/* <p className="mt-4 text-center text-xs text-white/20">KvK: XXXXXXXX</p> */}
      </div>
    </footer>
  );
}
