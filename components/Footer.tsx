import { Mail, Globe, MapPin } from "lucide-react";

const footerLinks = [
  { label: "Hoe het werkt", href: "#hoe-het-werkt" },
  { label: "Wat je krijgt", href: "#wat-je-krijgt" },
  { label: "Prijzen", href: "#prijzen" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold neon-text mb-3">NovaClaw AI</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              Nederlands bureau dat custom AI-agents bouwt voor bedrijven. Wij bouwen, testen en beheren — jij plukt de vruchten.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/40">
              <a href="mailto:info@novaclaw.tech" className="flex items-center gap-2 hover:text-neon-cyan transition-colors">
                <Mail size={14} /> info@novaclaw.tech
              </a>
              <a href="https://novaclaw.tech" className="flex items-center gap-2 hover:text-neon-cyan transition-colors">
                <Globe size={14} /> novaclaw.tech
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={14} /> Nederland
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Navigatie</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-neon-cyan transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Vertrouwen</h4>
            <ul className="space-y-2 text-sm text-white/40">
              <li>GDPR Compliant</li>
              <li>Data verwerking in EU</li>
              <li>Maandelijks opzegbaar</li>
              <li>100% op maat gebouwd</li>
            </ul>
            {/* KvK placeholder */}
            {/* <p className="mt-4 text-xs text-white/20">KvK: XXXXXXXX</p> */}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} NovaClaw AI. Alle rechten voorbehouden.
          </p>
          <div className="flex items-center gap-4">
            {/* Social placeholders */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-neon-cyan transition-colors text-xs">
              LinkedIn
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-neon-cyan transition-colors text-xs">
              Twitter/X
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
