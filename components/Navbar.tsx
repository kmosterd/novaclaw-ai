"use client";

import { useState, useEffect } from "react";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "@/components/LangProvider";
import { navbarT } from "@/lib/translations";

export default function Navbar() {
  const { lang, setLang } = useLang();
  const t = navbarT[lang];
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => setLang(lang === "nl" ? "en" : "nl");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/85 md:bg-black/60 md:backdrop-blur-xl border-b border-white/10 shadow-lg shadow-neon-purple/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold neon-text">NovaClaw</span>
            <span className="text-xs text-white/40 font-mono">AI</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {t.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-neon-cyan transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
              aria-label="Switch language"
            >
              <Globe size={12} />
              {lang === "nl" ? "EN" : "NL"}
            </button>

            <a
              href="#contact"
              className="ml-2 px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
            >
              {t.cta}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white/70 hover:text-white"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10">
          <div className="px-4 py-4 space-y-3">
            {t.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-white/70 hover:text-neon-cyan transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-neon-cyan transition-colors"
            >
              <Globe size={14} />
              {lang === "nl" ? "Switch to English" : "Schakel naar Nederlands"}
            </button>

            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white"
            >
              {t.cta}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
