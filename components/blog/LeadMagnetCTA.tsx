"use client";

import { useState } from "react";
import { Download, CheckCircle, Loader2, FileText } from "lucide-react";

interface LeadMagnetCTAProps {
  lang?: "nl" | "en";
}

const copy = {
  nl: {
    badge: "Gratis Download",
    title: "AI Agent Checklist",
    subtitle:
      "Ontdek welke AI agents het meeste impact hebben voor jouw bedrijf. Inclusief ROI-berekening en implementatieplan.",
    items: [
      "6 AI agent types met concrete voorbeelden",
      "ROI calculator per agent type",
      "Stap-voor-stap implementatiegids",
      "Vergelijkingstabel: welke agent past bij jou?",
    ],
    placeholder: "Jouw emailadres",
    button: "Download Gratis",
    gdpr: "Ik ga akkoord met het privacybeleid",
    success: "Check je inbox!",
    successSub: "De checklist is naar je email verstuurd.",
    downloadButton: "Direct downloaden",
    error: "Er ging iets mis. Probeer het opnieuw.",
  },
  en: {
    badge: "Free Download",
    title: "AI Agent Checklist",
    subtitle:
      "Discover which AI agents have the most impact for your business. Including ROI calculation and implementation plan.",
    items: [
      "6 AI agent types with concrete examples",
      "ROI calculator per agent type",
      "Step-by-step implementation guide",
      "Comparison table: which agent fits you?",
    ],
    placeholder: "Your email address",
    button: "Download Free",
    gdpr: "I agree to the privacy policy",
    success: "Check your inbox!",
    successSub: "The checklist has been sent to your email.",
    downloadButton: "Download directly",
    error: "Something went wrong. Please try again.",
  },
};

export default function LeadMagnetCTA({ lang = "nl" }: LeadMagnetCTAProps) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
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
          source: "lead_magnet",
          lang,
        }),
      });

      if (!res.ok) throw new Error("Subscribe failed");

      const data = await res.json();
      setDownloadUrl(data.downloadUrl || "/downloads/ai-agent-checklist.pdf");
      setStatus("success");

      // GA4 tracking
      if (typeof window !== "undefined" && (window as Record<string, unknown>).gtag) {
        (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag("event", "generate_lead", {
          event_category: "lead_magnet",
          event_label: "ai_agent_checklist",
          value: 5,
        });
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-dark rounded-2xl p-8 text-center border border-green-500/20">
        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-white mb-1">{t.success}</p>
        <p className="text-sm text-white/50 mb-6">{t.successSub}</p>
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            <Download className="w-4 h-4" />
            {t.downloadButton}
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="glass-dark rounded-2xl overflow-hidden border border-neon-purple/20">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left: Info */}
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-neon-purple/10 text-neon-purple border border-neon-purple/20 mb-3">
              <FileText className="w-3 h-3" />
              {t.badge}
            </span>

            <h3 className="text-xl font-bold text-white mb-2">{t.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              {t.subtitle}
            </p>

            <ul className="space-y-2">
              {t.items.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-white/60"
                >
                  <span className="text-neon-cyan mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div className="flex-1 max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                required
                className="glass-input text-sm"
              />

              <button
                type="submit"
                disabled={!agreed || status === "loading"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    {t.button}
                  </>
                )}
              </button>

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
                <p className="text-xs text-red-400">{t.error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
