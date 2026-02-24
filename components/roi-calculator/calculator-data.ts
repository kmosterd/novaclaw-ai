/**
 * AI Agent ROI Calculator — Data & Logic
 * Pure TypeScript, no React dependencies.
 */

export interface AgentType {
  id: string;
  icon: string;
  defaultHoursPerWeek: number;
  savingsMultiplier: number;
  labels: {
    nl: { name: string; description: string; savingsLabel: string };
    en: { name: string; description: string; savingsLabel: string };
  };
}

export const agentTypes: AgentType[] = [
  {
    id: "klantenservice",
    icon: "MessageSquare",
    defaultHoursPerWeek: 12,
    savingsMultiplier: 0.9,
    labels: {
      nl: {
        name: "Klantenservice Agent",
        description: "Klantberichten automatisch beantwoorden via email, chat en social media",
        savingsLabel: "Bespaarde uren klantenservice",
      },
      en: {
        name: "Customer Service Agent",
        description: "Automatically answer customer messages via email, chat and social media",
        savingsLabel: "Customer service hours saved",
      },
    },
  },
  {
    id: "content",
    icon: "FileText",
    defaultHoursPerWeek: 10,
    savingsMultiplier: 0.7,
    labels: {
      nl: {
        name: "Content Agent",
        description: "Van 1 stuk content naar 10+ variaties voor alle platformen",
        savingsLabel: "Bespaarde uren contentcreatie",
      },
      en: {
        name: "Content Agent",
        description: "From 1 piece of content to 10+ variations for all platforms",
        savingsLabel: "Content creation hours saved",
      },
    },
  },
  {
    id: "seo-aio",
    icon: "Search",
    defaultHoursPerWeek: 8,
    savingsMultiplier: 0.65,
    labels: {
      nl: {
        name: "SEO & AIO Agent",
        description: "Content die rankt bij Google en AI-zoekmachines",
        savingsLabel: "Bespaarde uren SEO-werk",
      },
      en: {
        name: "SEO & AIO Agent",
        description: "Content that ranks on Google and AI search engines",
        savingsLabel: "SEO work hours saved",
      },
    },
  },
  {
    id: "email-marketing",
    icon: "Mail",
    defaultHoursPerWeek: 6,
    savingsMultiplier: 0.75,
    labels: {
      nl: {
        name: "Email Marketing Agent",
        description: "Welkomstflows, sales funnels en campagnes op automatische piloot",
        savingsLabel: "Bespaarde uren email marketing",
      },
      en: {
        name: "Email Marketing Agent",
        description: "Welcome flows, sales funnels and campaigns on autopilot",
        savingsLabel: "Email marketing hours saved",
      },
    },
  },
  {
    id: "social-media",
    icon: "Share2",
    defaultHoursPerWeek: 8,
    savingsMultiplier: 0.7,
    labels: {
      nl: {
        name: "Social Media Agent",
        description: "Posts maken, reacties beheren en engagement analyseren",
        savingsLabel: "Bespaarde uren social media",
      },
      en: {
        name: "Social Media Agent",
        description: "Create posts, manage replies and analyze engagement",
        savingsLabel: "Social media hours saved",
      },
    },
  },
  {
    id: "automation",
    icon: "Workflow",
    defaultHoursPerWeek: 12,
    savingsMultiplier: 0.85,
    labels: {
      nl: {
        name: "Automation Agent",
        description: "Workflows automatiseren tussen al je systemen (CRM, boekhouding, etc.)",
        savingsLabel: "Bespaarde uren op workflows",
      },
      en: {
        name: "Automation Agent",
        description: "Automate workflows between all your systems (CRM, accounting, etc.)",
        savingsLabel: "Workflow hours saved",
      },
    },
  },
];

// --- ROI Calculation ---

export interface CalculatorInputs {
  selectedAgents: string[];
  hourlyRate: number;
  hoursPerWeek: Record<string, number>;
}

export interface AgentROIBreakdown {
  agentId: string;
  hoursSavedPerWeek: number;
  monthlySavingsEur: number;
  percentageOfTotal: number;
}

export interface ROIResult {
  totalHoursSavedPerWeek: number;
  totalHoursSavedPerMonth: number;
  totalHoursSavedPerYear: number;
  monthlySavingsEur: number;
  yearlySavingsEur: number;
  recommendedPlan: "starter" | "growth" | "enterprise";
  recommendedPlanLabel: { nl: string; en: string };
  monthlyPlanCost: number;
  netMonthlySavings: number;
  netYearlySavings: number;
  paybackPeriodDays: number;
  roiPercentage: number;
  perAgentBreakdown: AgentROIBreakdown[];
}

const WEEKS_PER_MONTH = 4.33;

export function calculateROI(inputs: CalculatorInputs): ROIResult {
  const perAgentBreakdown: AgentROIBreakdown[] = [];
  let totalHoursSavedPerWeek = 0;

  for (const agentId of inputs.selectedAgents) {
    const agent = agentTypes.find((a) => a.id === agentId);
    if (!agent) continue;

    const hoursSpent = inputs.hoursPerWeek[agentId] ?? agent.defaultHoursPerWeek;
    const hoursSaved = hoursSpent * agent.savingsMultiplier;
    totalHoursSavedPerWeek += hoursSaved;

    perAgentBreakdown.push({
      agentId,
      hoursSavedPerWeek: hoursSaved,
      monthlySavingsEur: hoursSaved * WEEKS_PER_MONTH * inputs.hourlyRate,
      percentageOfTotal: 0, // filled below
    });
  }

  const totalMonthlySavings = totalHoursSavedPerWeek * WEEKS_PER_MONTH * inputs.hourlyRate;

  // Fill percentage
  for (const breakdown of perAgentBreakdown) {
    breakdown.percentageOfTotal =
      totalMonthlySavings > 0
        ? (breakdown.monthlySavingsEur / totalMonthlySavings) * 100
        : 0;
  }

  // Recommend plan
  const agentCount = inputs.selectedAgents.length;
  let recommendedPlan: ROIResult["recommendedPlan"];
  let monthlyPlanCost: number;
  let recommendedPlanLabel: { nl: string; en: string };

  if (agentCount <= 1) {
    recommendedPlan = "starter";
    monthlyPlanCost = 497;
    recommendedPlanLabel = { nl: "Starter", en: "Starter" };
  } else if (agentCount <= 3) {
    recommendedPlan = "growth";
    monthlyPlanCost = 997;
    recommendedPlanLabel = { nl: "Growth", en: "Growth" };
  } else {
    recommendedPlan = "enterprise";
    monthlyPlanCost = 1497;
    recommendedPlanLabel = { nl: "Enterprise", en: "Enterprise" };
  }

  const yearlySavings = totalMonthlySavings * 12;
  const yearlyPlanCost = monthlyPlanCost * 12;
  const netMonthlySavings = totalMonthlySavings - monthlyPlanCost;
  const netYearlySavings = yearlySavings - yearlyPlanCost;

  const dailySavings = totalMonthlySavings / 30;
  const paybackPeriodDays =
    dailySavings > 0 ? Math.ceil(monthlyPlanCost / dailySavings) : 999;

  const roiPercentage =
    yearlyPlanCost > 0
      ? Math.round(((yearlySavings - yearlyPlanCost) / yearlyPlanCost) * 100)
      : 0;

  return {
    totalHoursSavedPerWeek,
    totalHoursSavedPerMonth: totalHoursSavedPerWeek * WEEKS_PER_MONTH,
    totalHoursSavedPerYear: totalHoursSavedPerWeek * 52,
    monthlySavingsEur: totalMonthlySavings,
    yearlySavingsEur: yearlySavings,
    recommendedPlan,
    recommendedPlanLabel,
    monthlyPlanCost,
    netMonthlySavings,
    netYearlySavings,
    paybackPeriodDays,
    roiPercentage,
    perAgentBreakdown,
  };
}

// --- Bilingual copy ---

export const calculatorCopy = {
  nl: {
    pageTitle: "AI Agent ROI Calculator",
    pageSubtitle:
      "Bereken in 2 minuten hoeveel je bespaart met AI agents. Gratis en vrijblijvend.",
    step1Title: "Welke AI agents wil je inzetten?",
    step1Subtitle: "Selecteer de agents die relevant zijn voor jouw bedrijf.",
    step2Title: "Jouw bedrijfsgegevens",
    step2Subtitle: "Vul je uurloon in en hoeveel tijd je per taak besteedt.",
    step3Title: "Jouw ROI Resultaat",
    step3Subtitle: "Dit is wat AI agents voor jouw bedrijf kunnen betekenen.",
    hourlyRateLabel: "Gemiddeld uurtarief (EUR)",
    hoursPerWeekLabel: "Uren per week besteed aan",
    nextButton: "Volgende",
    backButton: "Terug",
    calculateButton: "Bereken mijn ROI",
    recalculateButton: "Opnieuw berekenen",
    monthlySavings: "Maandelijkse besparing",
    yearlySavings: "Jaarlijkse besparing",
    paybackPeriod: "Terugverdientijd",
    days: "dagen",
    roi: "ROI",
    perMonth: "per maand",
    perYear: "per jaar",
    recommendedPlan: "Aanbevolen plan",
    planCost: "Kosten",
    netSavings: "Netto besparing",
    viewPlan: "Bekijk plan",
    breakdown: "Besparing per agent",
    hoursSaved: "uur/week bespaard",
    emailTitle: "Ontvang je ROI-rapport per email",
    emailSubtitle:
      "Inclusief gedetailleerde breakdown per agent en implementatieadvies.",
    emailPlaceholder: "Jouw emailadres",
    emailButton: "Verstuur rapport",
    emailGdpr: "Ik ga akkoord met het privacybeleid",
    emailSuccess: "Rapport verstuurd! Check je inbox.",
    emailError: "Er ging iets mis. Probeer het opnieuw.",
    selectAtLeastOne: "Selecteer minimaal 1 agent",
  },
  en: {
    pageTitle: "AI Agent ROI Calculator",
    pageSubtitle:
      "Calculate in 2 minutes how much you save with AI agents. Free, no strings attached.",
    step1Title: "Which AI agents do you want to use?",
    step1Subtitle: "Select the agents relevant to your business.",
    step2Title: "Your business details",
    step2Subtitle: "Enter your hourly rate and time spent per task.",
    step3Title: "Your ROI Result",
    step3Subtitle: "This is what AI agents can do for your business.",
    hourlyRateLabel: "Average hourly rate (EUR)",
    hoursPerWeekLabel: "Hours per week spent on",
    nextButton: "Next",
    backButton: "Back",
    calculateButton: "Calculate my ROI",
    recalculateButton: "Recalculate",
    monthlySavings: "Monthly savings",
    yearlySavings: "Yearly savings",
    paybackPeriod: "Payback period",
    days: "days",
    roi: "ROI",
    perMonth: "per month",
    perYear: "per year",
    recommendedPlan: "Recommended plan",
    planCost: "Cost",
    netSavings: "Net savings",
    viewPlan: "View plan",
    breakdown: "Savings per agent",
    hoursSaved: "hrs/week saved",
    emailTitle: "Get your ROI report by email",
    emailSubtitle:
      "Including detailed per-agent breakdown and implementation advice.",
    emailPlaceholder: "Your email address",
    emailButton: "Send report",
    emailGdpr: "I agree to the privacy policy",
    emailSuccess: "Report sent! Check your inbox.",
    emailError: "Something went wrong. Please try again.",
    selectAtLeastOne: "Select at least 1 agent",
  },
};
