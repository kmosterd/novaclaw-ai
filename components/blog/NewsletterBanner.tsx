"use client";

import { useState } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";

interface NewsletterBannerProps {
  lang?: "nl" | "en";
}

const copy = {
  nl: {
    title: "Ontvang wekelijks AI-tips in je inbox",
    subtitle:
      "Blijf op de hoogte van de laatste AI trends, tools en strategieën voor bedrijfsgroei.",
    placeholder: "Jouw emailadres",
    button: "Aanmelden",
    gdpr: "Ik ga akkoord met het privacybeleid",
    success: "Je bent aangemeld!",
    successSub: "Check je inbox voor een bevestiging.",
    error: "Er ging iets mis. Probeer het opnieuw.",
  },
  en: {
    title: "Get weekly AI tips in your inbox",
    subtitle:
      "Stay up to date with the latest AI trends, tools and strategies for business growth.",
    placeholder: "Your email address",
    button: "Subscribe",
    gdpr: "I agree to the privacy policy",
    success: "You're subscribed!",
    successSub: "Check your inbox for a confirmation.",
    error: "Something went wrong. Please try again.",
  },
};

export default function NewsletterBanner({ lang = "nl" }: NewsletterBannerProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = copy[lang];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !agreed) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "newsletter",
          lang,
        }),
      });

      if (!res.ok) throw new Error("Subscribe failed");

      setStatus("success");

      // GA4 tracking
      if (typeof window !== "undefined" && (window as Record<string, unknown>).gtag) {
        (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag("event", "generate_lead", {
          event_category: "newsletter",
          event_label: "blog_newsletter_banner",
          value: 1,
        });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center">
        <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
        <p className="text-white font-semibold mb-1">{t.success}</p>
        <p className="text-sm text-white/50">{t.successSub}</p>
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl p-6 md:p-8 border border-neon-cyan/10">
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: Text */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-lg font-semibold text-white">{t.title}</h3>
          </div>
          <p className="text-sm text-white/50 leading-relaxed">{t.subtitle}</p>
        </div>

        {/* Right: Form */}
        <form onSubmit={handleSubmit} className="flex-1 max-w-md">
          <div className="flex gap-2 mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              className="glass-input flex-1 !py-2.5 text-sm"
            />
            <button
              type="submit"
              disabled={!agreed || status === "loading"}
              className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t.button
              )}
            </button>
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-white/5 text-neon-cyan focus:ring-neon-cyan/30"
            />
            <span className="text-xs text-white/40">{t.gdpr}</span>
          </label>

          {status === "error" && (
            <p className="text-xs text-red-400 mt-2">{t.error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
