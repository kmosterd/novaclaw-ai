import Link from "next/link";
import { Mail, Globe, MapPin } from "lucide-react";
import { getServerLang } from "@/lib/i18n";
import { footerT, servicesT } from "@/lib/translations";

export default async function Footer() {
  const lang = await getServerLang();
  const t = footerT[lang];
  const svc = servicesT[lang];

  // Build agent link lists from services translations
  const agentsCommunication = svc.categories[0].agents.map((a) => ({
    label: a.title,
    href: "/#diensten",
  }));
  const agentsMarketing = svc.categories[1].agents.map((a) => ({
    label: a.title,
    href: "/#diensten",
  }));
  const agentsSales = svc.categories[2].agents.map((a) => ({
    label: a.title,
    href: "/#diensten",
  }));
  const agentsData = svc.categories[3].agents.map((a) => ({
    label: a.title,
    href: "/#diensten",
  }));

  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-5">
          {/* Brand & Contact */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold neon-text mb-3">NovaClaw AI</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              {t.description}
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
                <MapPin size={14} /> {t.location}
              </span>
            </div>
          </div>

          {/* Customer & Sales Agents */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              {t.colKlantSales}
            </h4>
            <ul className="space-y-2">
              {[...agentsCommunication, ...agentsSales].map((item) => (
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

          {/* Marketing & Data */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              {t.colMarketingData}
            </h4>
            <ul className="space-y-2">
              {[...agentsMarketing, ...agentsData.slice(0, 3)].map((item) => (
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

          {/* Operations + Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              {t.colOperations}
            </h4>
            <ul className="space-y-2">
              {agentsData.slice(3).map((item) => (
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
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mt-6 mb-4">
              {t.colResources}
            </h4>
            <ul className="space-y-2">
              {t.resources.map((item) => (
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

          {/* Blog Articles */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">
              {t.colBlog}
            </h4>
            <ul className="space-y-2">
              {t.blogLinks.map((item) => (
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

        {/* Trust signals */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {t.trustBadges.map((badge) => (
              <span
                key={badge}
                className="text-xs text-white/30 px-3 py-1 rounded-full border border-white/10"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            {t.copyright(new Date().getFullYear())}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/blog"
              className="text-white/30 hover:text-neon-cyan transition-colors text-xs"
            >
              Blog
            </Link>
            <Link
              href="/#faq"
              className="text-white/30 hover:text-neon-cyan transition-colors text-xs"
            >
              FAQ
            </Link>
            <Link
              href="/#contact"
              className="text-white/30 hover:text-neon-cyan transition-colors text-xs"
            >
              Contact
            </Link>
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
      </div>
    </footer>
  );
}
