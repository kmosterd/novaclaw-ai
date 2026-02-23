"use client";

import { useState } from "react";
import { Mail, Download, CheckCircle, Loader2 } from "lucide-react";

interface InlineArticleCTAProps {
  variant?: "newsletter" | "lead_magnet";
  lang?: "nl" | "en";
}

const copy = {
  nl: {
    newsletter: {
      icon: Mail,
      title: "Vind je dit interessant?",
      subtitle: "Ontvang wekelijks AI-tips en trends in je inbox.",
      placeholder: "Jouw emailadres",
      button: "Aanmelden",
      success: "Je bent aangemeld!",
    },
    lead_magnet: {
      icon: Download,
      title: "Gratis AI Agent Checklist",
      subtitle: "Download de checklist en ontdek welke AI agents bij jouw bedrijf passen.",
      placeholder: "Jouw emailadres",
      button: "Download",
      success: "Check je inbox!",
    },
    gdpr: "Ik ga akkoord met het privacybeleid",
    error: "Probeer het opnieuw.",
  },
  en: {
    newsletter: {
      icon: Mail,
      title: "Enjoying this article?",
      subtitle: "Get weekly AI tips and trends in your inbox.",
      placeholder: "Your email address",
      button: "Subscribe",
      success: "You're subscribed!",
    },
    lead_magnet: {
      icon: Download,
      title: "Free AI Agent Checklist",
      subtitle: "Download the checklist and discover which AI agents fit your business.",
      placeholder: "Your email address",
      button: "Download",
      success: "Check your inbox!",
    },
    gdpr: "I agree to the privacy policy",
    error: "Please try again.",
  },
};

export default function InlineArticleCTA({
  variant = "newsletter",
  lang = "nl",
}: InlineArticleCTAProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const t = copy[lang][variant];
  const tShared = copy[lang];
  const Icon = t.icon;

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
          source: variant === "lead_magnet" ? "lead_magnet" : "inline_cta",
          lang,
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");

      // GA4 tracking
      if (typeof window !== "undefined" && (window as Record<string, unknown>).gtag) {
        (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag("event", "generate_lead", {
          event_category: "inline_cta",
          event_label: `blog_inline_${variant}`,
          value: variant === "lead_magnet" ? 5 : 1,
        });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="my-8 glass-dark rounded-xl p-5 text-center border border-green-500/20">
        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-white">{t.success}</p>
      </div>
    );
  }

  return (
    <div className="my-8 glass-dark rounded-xl p-5 border border-neon-cyan/10">
      <div className="flex items-start gap-3 mb-3">
        <Icon className="w-5 h-5 text-neon-cyan mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-white">{t.title}</p>
          <p className="text-xs text-white/50">{t.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            required
            className="glass-input flex-1 !py-2 text-xs"
          />
          <button
            type="submit"
            disabled={!agreed || status === "loading"}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {status === "loading" ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              t.button
            )}
          </button>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="rounded border-white/20 bg-white/5 text-neon-cyan focus:ring-neon-cyan/30 w-3 h-3"
          />
          <span className="text-[10px] text-white/30">{tShared.gdpr}</span>
        </label>

        {status === "error" && (
          <p className="text-[10px] text-red-400 mt-1">{tShared.error}</p>
        )}
      </form>
    </div>
  );
}
