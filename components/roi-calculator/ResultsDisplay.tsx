"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Clock,
  Percent,
  Euro,
  ArrowRight,
  Mail,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  ROIResult,
  agentTypes,
  calculatorCopy,
} from "./calculator-data";

interface ResultsDisplayProps {
  result: ROIResult;
  lang: "nl" | "en";
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  duration = 1200,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {display.toLocaleString("nl-NL")}
      {suffix}
    </span>
  );
}

export default function ResultsDisplay({ result, lang }: ResultsDisplayProps) {
  const t = calculatorCopy[lang];
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !agreed) return;

    setEmailStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source: "roi_calculator",
          lang,
          metadata: {
            monthlySavingsEur: Math.round(result.monthlySavingsEur),
            yearlySavingsEur: Math.round(result.yearlySavingsEur),
            recommendedPlan: result.recommendedPlan,
            paybackPeriodDays: result.paybackPeriodDays,
            roiPercentage: result.roiPercentage,
            agentCount: result.perAgentBreakdown.length,
            agents: result.perAgentBreakdown.map((a) => a.agentId).join(", "),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setEmailStatus("success");

      if (
        typeof window !== "undefined" &&
        (window as Record<string, unknown>).gtag
      ) {
        (
          window as Record<string, unknown> & {
            gtag: (...args: unknown[]) => void;
          }
        ).gtag("event", "generate_lead", {
          event_category: "roi_calculator",
          event_label: "roi_report_email",
          value: 10,
        });
      }
    } catch {
      setEmailStatus("error");
    }
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<Euro className="w-5 h-5" />}
          label={t.monthlySavings}
          value={
            <AnimatedNumber
              value={Math.round(result.monthlySavingsEur)}
              prefix="€"
            />
          }
          sublabel={t.perMonth}
          accent="cyan"
        />
        <SummaryCard
          icon={<TrendingUp className="w-5 h-5" />}
          label={t.yearlySavings}
          value={
            <AnimatedNumber
              value={Math.round(result.yearlySavingsEur)}
              prefix="€"
            />
          }
          sublabel={t.perYear}
          accent="purple"
        />
        <SummaryCard
          icon={<Clock className="w-5 h-5" />}
          label={t.paybackPeriod}
          value={
            <AnimatedNumber
              value={result.paybackPeriodDays}
              suffix={` ${t.days}`}
            />
          }
          sublabel=""
          accent="magenta"
        />
        <SummaryCard
          icon={<Percent className="w-5 h-5" />}
          label={t.roi}
          value={
            <AnimatedNumber value={result.roiPercentage} suffix="%" />
          }
          sublabel="return on investment"
          accent="cyan"
        />
      </div>

      {/* Per-agent breakdown */}
      <div className="glass-dark rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-5">
          {t.breakdown}
        </h3>
        <div className="space-y-5">
          {result.perAgentBreakdown.map((breakdown) => {
            const agent = agentTypes.find((a) => a.id === breakdown.agentId);
            if (!agent) return null;
            const label = agent.labels[lang];

            return (
              <div key={breakdown.agentId}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-white">
                    {label.name}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-white/50">
                    <span>
                      {breakdown.hoursSavedPerWeek.toFixed(1)} {t.hoursSaved}
                    </span>
                    <span className="text-neon-cyan font-medium">
                      €{Math.round(breakdown.monthlySavingsEur).toLocaleString("nl-NL")}/mo
                    </span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-1000 ease-out"
                    style={{ width: `${Math.max(breakdown.percentageOfTotal, 3)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended plan */}
      <div className="glass-dark rounded-2xl overflow-hidden border border-neon-cyan/20">
        <div className="h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta" />
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-neon-cyan font-medium mb-1">
              {t.recommendedPlan}
            </p>
            <p className="text-xl font-bold text-white">
              {result.recommendedPlanLabel[lang]}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
              <span>
                {t.planCost}: €{result.monthlyPlanCost}/mo
              </span>
              <span className="text-neon-cyan font-medium">
                {t.netSavings}: €
                {Math.round(result.netMonthlySavings).toLocaleString("nl-NL")}
                /mo
              </span>
            </div>
          </div>
          <Link
            href="/#prijzen"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {t.viewPlan}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Email gate (after results — not blocking) */}
      <div className="glass-dark rounded-2xl p-6 border border-white/5">
        {emailStatus === "success" ? (
          <div className="text-center py-4">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-white">{t.emailSuccess}</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 mb-4">
              <Mail className="w-5 h-5 text-neon-cyan mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {t.emailTitle}
                </p>
                <p className="text-xs text-white/50">{t.emailSubtitle}</p>
              </div>
            </div>

            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-2 mb-2"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                className="glass-input flex-1 !py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={!agreed || emailStatus === "loading"}
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {emailStatus === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t.emailButton
                )}
              </button>
            </form>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-white/20 bg-white/5 text-neon-cyan focus:ring-neon-cyan/30 w-3.5 h-3.5"
              />
              <span className="text-xs text-white/40">{t.emailGdpr}</span>
            </label>

            {emailStatus === "error" && (
              <p className="text-xs text-red-400 mt-2">{t.emailError}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  sublabel,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  sublabel: string;
  accent: "cyan" | "purple" | "magenta";
}) {
  const accentColor = {
    cyan: "text-neon-cyan",
    purple: "text-neon-purple",
    magenta: "text-neon-magenta",
  }[accent];

  return (
    <div className="glass-dark rounded-xl p-4">
      <div className={`${accentColor} mb-2`}>{icon}</div>
      <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`text-xl sm:text-2xl font-bold ${accentColor}`}>{value}</p>
      {sublabel && (
        <p className="text-[10px] text-white/30 mt-0.5">{sublabel}</p>
      )}
    </div>
  );
}
