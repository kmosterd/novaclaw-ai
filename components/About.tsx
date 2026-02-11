import { Shield, Zap, Users } from "lucide-react";

export default function About() {
  return (
    <section id="over-ons" className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-neon-magenta text-sm font-semibold tracking-widest uppercase mb-3">
          Over NovaClaw
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Nederlands Bureau voor AI Agents
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
          NovaClaw is opgericht met een duidelijke missie: AI-technologie toegankelijk maken voor elk bedrijf in Nederland. Wij geloven dat je geen groot IT-team nodig hebt om te profiteren van kunstmatige intelligentie. Ons team bouwt, test en beheert custom AI agents zodat jij je kunt focussen op wat je het beste doet: ondernemen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-neon-cyan/10 flex items-center justify-center mx-auto mb-5">
            <Zap className="text-neon-cyan" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-3">100% Op Maat</h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Geen standaard templates. Elke AI agent wordt specifiek gebouwd voor jouw bedrijf, merk en doelgroep. Unieke oplossingen voor unieke uitdagingen.
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-neon-purple/10 flex items-center justify-center mx-auto mb-5">
            <Shield className="text-neon-purple" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-3">Privacy & Veiligheid</h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Volledig GDPR-compliant met dataverwerking binnen de EU. Enterprise-grade beveiliging en encryptie. Jouw data blijft van jou.
          </p>
        </div>

        <div className="glass-dark rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-xl bg-neon-magenta/10 flex items-center justify-center mx-auto mb-5">
            <Users className="text-neon-magenta" size={28} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-3">Nederlands Team</h3>
          <p className="text-sm text-white/40 leading-relaxed">
            Persoonlijke begeleiding in het Nederlands. Geen chatbot-support maar echte mensen die jouw business begrijpen en meedenken.
          </p>
        </div>
      </div>
    </section>
  );
}
