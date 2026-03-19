import { getServerLang } from "@/lib/i18n";
import { agentProductsT } from "@/lib/translations";
import {
  Bot,
  Search,
  Zap,
  Shield,
  Globe,
  BarChart3,
  MessageSquareMore,
  Database,
  CheckCircle2,
} from "lucide-react";

export default async function AgentProducts() {
  const lang = await getServerLang();
  const t = agentProductsT[lang];

  return (
    <section
      id="producten"
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-neon-cyan text-sm font-semibold tracking-widest uppercase">
            {t.label}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            {t.heading}
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        {/* Product cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* OpenClaw */}
          <div className="relative group glass rounded-2xl p-8 border border-neon-cyan/20 hover:border-neon-cyan/50 transition-all duration-500 animate-fade-in-up">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-xs font-semibold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              {t.openclaw.badge}
            </div>

            {/* Icon + name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                <Bot className="w-7 h-7 text-neon-cyan" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">OpenClaw</h3>
                <p className="text-sm text-neon-cyan font-medium">by NovaClaw</p>
              </div>
            </div>

            <p className="text-white/60 text-base leading-relaxed mb-6">
              {t.openclaw.description}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {t.openclaw.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-white/70">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Use cases */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: MessageSquareMore, label: t.openclaw.usecases[0] },
                { icon: Zap, label: t.openclaw.usecases[1] },
                { icon: Globe, label: t.openclaw.usecases[2] },
                { icon: Shield, label: t.openclaw.usecases[3] },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                  <Icon className="w-4 h-4 text-neon-cyan" strokeWidth={1.5} />
                  <span className="text-xs text-white/60">{label}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-neon-cyan to-cyan-400 text-black hover:opacity-90 transition-opacity text-sm"
            >
              {t.openclaw.cta}
            </a>
          </div>

          {/* NemoClaw */}
          <div className="relative group glass rounded-2xl p-8 border border-neon-purple/20 hover:border-neon-purple/50 transition-all duration-500 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple text-xs font-semibold mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
              {t.nemoclaw.badge}
            </div>

            {/* Icon + name */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
                <Search className="w-7 h-7 text-neon-purple" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">NemoClaw</h3>
                <p className="text-sm text-neon-purple font-medium">by NovaClaw</p>
              </div>
            </div>

            <p className="text-white/60 text-base leading-relaxed mb-6">
              {t.nemoclaw.description}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {t.nemoclaw.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span className="text-sm text-white/70">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Use cases */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { icon: Search, label: t.nemoclaw.usecases[0] },
                { icon: BarChart3, label: t.nemoclaw.usecases[1] },
                { icon: Database, label: t.nemoclaw.usecases[2] },
                { icon: Zap, label: t.nemoclaw.usecases[3] },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/5">
                  <Icon className="w-4 h-4 text-neon-purple" strokeWidth={1.5} />
                  <span className="text-xs text-white/60">{label}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-neon-purple to-violet-500 text-white hover:opacity-90 transition-opacity text-sm"
            >
              {t.nemoclaw.cta}
            </a>
          </div>
        </div>

        {/* Bottom comparison bar */}
        <div className="mt-12 glass-dark rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <p className="text-center text-sm text-white/40 mb-4">{t.compareLabel}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {t.comparePoints.map((point, i) => (
              <div key={i}>
                <div className="text-lg font-bold neon-text">{point.value}</div>
                <div className="text-xs text-white/40 mt-1">{point.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
