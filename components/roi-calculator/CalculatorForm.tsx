"use client";

import { useState, useMemo } from "react";
import {
  MessageSquare,
  FileText,
  Search,
  Mail,
  Share2,
  Workflow,
  ArrowLeft,
  ArrowRight,
  Calculator,
  RotateCcw,
} from "lucide-react";
import {
  agentTypes,
  calculatorCopy,
  calculateROI,
  type CalculatorInputs,
} from "./calculator-data";
import ResultsDisplay from "./ResultsDisplay";
import { useLang } from "@/components/LangProvider";

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Search: <Search className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
  Workflow: <Workflow className="w-6 h-6" />,
};

export default function CalculatorForm() {
  const { lang } = useLang();
  const [step, setStep] = useState(1);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [hoursPerWeek, setHoursPerWeek] = useState<Record<string, number>>({});

  const t = calculatorCopy[lang];

  function toggleAgent(id: string) {
    setSelectedAgents((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  function getHours(agentId: string): number {
    if (hoursPerWeek[agentId] !== undefined) return hoursPerWeek[agentId];
    return agentTypes.find((a) => a.id === agentId)?.defaultHoursPerWeek ?? 8;
  }

  function setHours(agentId: string, hours: number) {
    setHoursPerWeek((prev) => ({ ...prev, [agentId]: hours }));
  }

  const inputs: CalculatorInputs = useMemo(
    () => ({
      selectedAgents,
      hourlyRate,
      hoursPerWeek: Object.fromEntries(
        selectedAgents.map((id) => [id, getHours(id)])
      ),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedAgents, hourlyRate, hoursPerWeek]
  );

  const result = useMemo(() => {
    if (step < 3 || selectedAgents.length === 0) return null;
    return calculateROI(inputs);
  }, [step, selectedAgents, inputs]);

  function goToResults() {
    setStep(3);
    // GA4 tracking
    if (typeof window !== "undefined" && (window as Record<string, unknown>).gtag) {
      (window as Record<string, unknown> & { gtag: (...args: unknown[]) => void }).gtag(
        "event",
        "calculator_complete",
        {
          event_category: "roi_calculator",
          event_label: `agents_${selectedAgents.length}`,
          value: selectedAgents.length,
        }
      );
    }
  }

  function reset() {
    setStep(1);
    setSelectedAgents([]);
    setHourlyRate(75);
    setHoursPerWeek({});
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Calculator className="w-6 h-6 text-neon-cyan" />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t.pageTitle}
          </h1>
        </div>
        <p className="text-white/50 max-w-lg mx-auto text-sm">
          {t.pageSubtitle}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                s === step
                  ? "bg-neon-cyan text-black"
                  : s < step
                    ? "bg-neon-cyan/20 text-neon-cyan"
                    : "bg-white/5 text-white/30"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-0.5 rounded ${
                  s < step ? "bg-neon-cyan/30" : "bg-white/10"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select agents */}
      {step === 1 && (
        <div className="animate-fade-in-up">
          <h2 className="text-lg font-semibold text-white mb-1">
            {t.step1Title}
          </h2>
          <p className="text-sm text-white/40 mb-6">{t.step1Subtitle}</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {agentTypes.map((agent) => {
              const selected = selectedAgents.includes(agent.id);
              const label = agent.labels[lang];
              return (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`text-left glass-dark rounded-xl p-5 transition-all duration-200 border ${
                    selected
                      ? "border-neon-cyan/50 bg-neon-cyan/5"
                      : "border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 ${selected ? "text-neon-cyan" : "text-white/30"}`}
                    >
                      {iconMap[agent.icon]}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${selected ? "text-white" : "text-white/70"}`}
                      >
                        {label.name}
                      </p>
                      <p className="text-xs text-white/40 mt-1 leading-relaxed">
                        {label.description}
                      </p>
                    </div>
                  </div>
                  {/* Checkbox indicator */}
                  <div className="flex justify-end mt-3">
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selected
                          ? "bg-neon-cyan border-neon-cyan text-black"
                          : "border-white/20"
                      }`}
                    >
                      {selected && (
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={selectedAgents.length === 0}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t.nextButton}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {selectedAgents.length === 0 && (
            <p className="text-xs text-white/30 text-right mt-2">
              {t.selectAtLeastOne}
            </p>
          )}
        </div>
      )}

      {/* Step 2: Input details */}
      {step === 2 && (
        <div className="animate-fade-in-up">
          <h2 className="text-lg font-semibold text-white mb-1">
            {t.step2Title}
          </h2>
          <p className="text-sm text-white/40 mb-6">{t.step2Subtitle}</p>

          <div className="space-y-6 mb-8">
            {/* Hourly rate */}
            <div className="glass-dark rounded-xl p-5">
              <label className="block text-sm font-medium text-white mb-3">
                {t.hourlyRateLabel}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={15}
                  max={300}
                  step={5}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="flex-1 accent-[#00f5ff] h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-cyan [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-neon-cyan font-bold text-xl">€</span>
                  <input
                    type="number"
                    min={15}
                    max={500}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value) || 15)}
                    className="glass-input w-20 !py-1.5 text-center text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Hours per agent */}
            {selectedAgents.map((agentId) => {
              const agent = agentTypes.find((a) => a.id === agentId);
              if (!agent) return null;
              const label = agent.labels[lang];

              return (
                <div key={agentId} className="glass-dark rounded-xl p-5">
                  <label className="block text-sm font-medium text-white mb-1">
                    {t.hoursPerWeekLabel}{" "}
                    <span className="text-neon-cyan">{label.name}</span>
                  </label>
                  <p className="text-xs text-white/30 mb-3">
                    {label.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={40}
                      step={1}
                      value={getHours(agentId)}
                      onChange={(e) =>
                        setHours(agentId, Number(e.target.value))
                      }
                      className="flex-1 accent-[#00f5ff] h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-cyan [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={getHours(agentId)}
                        onChange={(e) =>
                          setHours(agentId, Number(e.target.value) || 1)
                        }
                        className="glass-input w-16 !py-1.5 text-center text-sm font-medium"
                      />
                      <span className="text-xs text-white/40">u/w</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backButton}
            </button>
            <button
              onClick={goToResults}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
            >
              {t.calculateButton}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t.step3Title}
              </h2>
              <p className="text-sm text-white/40">{t.step3Subtitle}</p>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 text-xs text-white/40 hover:text-white border border-white/10 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t.recalculateButton}
            </button>
          </div>

          <ResultsDisplay result={result} lang={lang} />
        </div>
      )}
    </div>
  );
}
