"use client";

import { useState } from "react";

const businessTypes = [
  "E-commerce / Webshop",
  "Marketing & Communicatie",
  "Financiële dienstverlening",
  "Juridisch / Advocatuur",
  "IT & Software",
  "Gezondheidszorg",
  "Productie & Logistiek",
  "Horeca & Retail",
  "Consultancy",
  "Anders"
];

const businessGoals = [
  "Leads genereren & opvolgen",
  "Klantenservice automatiseren",
  "Content creatie automatiseren",
  "Interne processen stroomlijnen",
  "Data analyse & rapportages",
  "Sales ondersteuning",
  "Social media beheer",
  "Anders"
];

const budgetRanges = [
  "Starter (€497/maand)",
  "Growth (€997/maand)",
  "Enterprise (op maat)",
  "Weet ik nog niet"
];

export default function Hero() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    businessType: "",
    businessGoal: "",
    budget: "",
    gdprConsent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gdprConsent) {
      setError("Je moet akkoord gaan met de privacyvoorwaarden.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          source: "hero_form",
          metadata: {
            business_type: formData.businessType,
            business_goal: formData.businessGoal,
            budget: formData.budget,
            gdpr_consent: true,
            consent_timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) throw new Error("Verzenden mislukt");
      setIsSubmitted(true);

      // GA4 conversie event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          event_category: "form",
          event_label: formData.businessGoal || "hero_form",
          value: formData.budget || "unknown",
        });
      }
    } catch (err) {
      setError("Er ging iets mis. Probeer het opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Wij Bouwen</span>
            <br />
            <span className="text-white">Jouw AI Agents</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">NovaClaw is een Nederlands bureau dat custom AI-agents ontwikkelt voor jouw bedrijf. Wij bouwen, testen en beheren - jij plukt de vruchten.</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>100% op maat</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>GDPR compliant</span></div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-400 rounded-full" /><span>Nederlands team</span></div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="bg-gray-900/90 md:bg-gray-900/50 md:backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Bedankt!</h3>
                <p className="text-gray-400">We nemen binnen 24 uur contact met je op.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-2">Plan een Gratis Gesprek</h2>
                <p className="text-gray-400 mb-6">Vertel ons over jouw bedrijf.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Naam *</label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none" placeholder="Je naam" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Email *</label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none" placeholder="je@email.nl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Bedrijfsnaam</label>
                    <input type="text" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none" placeholder="Je bedrijf" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type bedrijf</label>
                    <select value={formData.businessType} onChange={(e) => setFormData({...formData, businessType: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
                      <option value="">Selecteer...</option>
                      {businessTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Wat wil je automatiseren?</label>
                    <select value={formData.businessGoal} onChange={(e) => setFormData({...formData, businessGoal: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
                      <option value="">Selecteer...</option>
                      {businessGoals.map((goal) => (<option key={goal} value={goal}>{goal}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Budget indicatie</label>
                    <select value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none">
                      <option value="">Selecteer...</option>
                      {budgetRanges.map((range) => (<option key={range} value={range}>{range}</option>))}
                    </select>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="gdpr" checked={formData.gdprConsent} onChange={(e) => setFormData({...formData, gdprConsent: e.target.checked})} className="mt-1 w-4 h-4" />
                    <label htmlFor="gdpr" className="text-sm text-gray-400">Ik ga akkoord met de verwerking van mijn gegevens conform de privacyvoorwaarden. *</label>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50">
                    {isSubmitting ? "Verzenden..." : "Plan Gratis Gesprek →"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
