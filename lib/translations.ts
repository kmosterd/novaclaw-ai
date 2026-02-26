/* ============================================================
   Central translations for the entire NovaClaw website.
   Pattern: { nl: {...}, en: {...} } per component section.
   ============================================================ */

// ─── LAYOUT / METADATA ──────────────────────────────────────
export const layoutT = {
  nl: {
    title: "NovaClaw AI | Custom AI Agents voor Bedrijven in Nederland",
    description:
      "NovaClaw is een Nederlands bureau dat meer dan 18 typen custom AI-agents bouwt voor bedrijven. Van klantenservice en voice agents tot lead generation, content automation, SEO & AIO, e-commerce en data analytics agents. Powered by OpenAI, Claude, Gemini. GDPR-compliant, 100% op maat.",
    ogTitle: "NovaClaw AI | Custom AI Agents voor Bedrijven",
    ogDescription:
      "Nederlands bureau dat meer dan 18 typen custom AI-agents bouwt: klantenservice, voice, content, SEO, lead generation, e-commerce, data analytics en meer. Powered by OpenAI, Claude & Gemini.",
    twitterDescription: "Nederlands bureau voor custom AI agents. Wij bouwen, jij groeit.",
  },
  en: {
    title: "NovaClaw AI | Custom AI Agents for Businesses",
    description:
      "NovaClaw is a Dutch agency that builds more than 18 types of custom AI agents for businesses. From customer service and voice agents to lead generation, content automation, SEO & AIO, e-commerce and data analytics agents. Powered by OpenAI, Claude, Gemini. GDPR-compliant, 100% custom.",
    ogTitle: "NovaClaw AI | Custom AI Agents for Businesses",
    ogDescription:
      "Dutch agency building more than 18 types of custom AI agents: customer service, voice, content, SEO, lead generation, e-commerce, data analytics and more. Powered by OpenAI, Claude & Gemini.",
    twitterDescription: "Dutch agency for custom AI agents. We build, you grow.",
  },
} as const;

// ─── NAVBAR ─────────────────────────────────────────────────
export const navbarT = {
  nl: {
    links: [
      { label: "Diensten", href: "#diensten" },
      { label: "Resultaten", href: "#resultaten" },
      { label: "Hoe het werkt", href: "#hoe-het-werkt" },
      { label: "Prijzen", href: "#prijzen" },
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
    ],
    cta: "Gratis Gesprek",
  },
  en: {
    links: [
      { label: "Services", href: "#diensten" },
      { label: "Results", href: "#resultaten" },
      { label: "How it works", href: "#hoe-het-werkt" },
      { label: "Pricing", href: "#prijzen" },
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "/blog" },
    ],
    cta: "Free Consultation",
  },
} as const;

// ─── HERO ───────────────────────────────────────────────────
export const heroT = {
  nl: {
    headingLine1: "Wij bouwen",
    headingLine2: "jouw AI agents",
    subtitle:
      "NovaClaw is een Nederlands bureau dat custom AI-agents ontwikkelt voor jouw bedrijf. Elke klant krijgt een eigen beveiligde OpenClaw bot, volledig getraind op jouw bedrijf. Wij bouwen, testen en beheren.",
    badges: ["Eigen OpenClaw bot", "GDPR compliant", "Nederlands team"],
    formTitle: "Plan een Gratis Gesprek",
    formSubtitle: "Vertel ons over jouw bedrijf.",
    labels: {
      name: "Naam *",
      email: "Email *",
      company: "Bedrijfsnaam",
      businessType: "Type bedrijf",
      goal: "Wat wil je automatiseren?",
      budget: "Budget indicatie",
    },
    placeholders: {
      name: "Je naam",
      email: "je@email.nl",
      company: "Je bedrijf",
      select: "Selecteer...",
    },
    businessTypes: [
      "E-commerce / Webshop",
      "Marketing & Communicatie",
      "Financiële dienstverlening",
      "Juridisch / Advocatuur",
      "IT & Software",
      "Gezondheidszorg",
      "Productie & Logistiek",
      "Horeca & Retail",
      "Consultancy",
      "Anders",
    ],
    businessGoals: [
      "Leads genereren & opvolgen",
      "Klantenservice automatiseren",
      "Content creatie automatiseren",
      "Interne processen stroomlijnen",
      "Data analyse & rapportages",
      "Sales ondersteuning",
      "Social media beheer",
      "Anders",
    ],
    budgetRanges: [
      "Starter (€497/maand)",
      "Growth (€997/maand)",
      "Enterprise (op maat)",
      "Weet ik nog niet",
    ],
    gdpr: "Ik ga akkoord met de verwerking van mijn gegevens conform de privacyvoorwaarden. *",
    gdprError: "Je moet akkoord gaan met de privacyvoorwaarden.",
    submitError: "Er ging iets mis. Probeer het opnieuw.",
    submitting: "Verzenden...",
    submitButton: "Plan Gratis Gesprek →",
    successTitle: "Bedankt!",
    successMessage: "We nemen binnen 24 uur contact met je op.",
  },
  en: {
    headingLine1: "We Build",
    headingLine2: "Your AI Agents",
    subtitle:
      "NovaClaw is a Dutch agency that develops custom AI agents for your business. Every client gets their own secure OpenClaw bot, fully trained on your business. We build, test and manage.",
    badges: ["Your own OpenClaw bot", "GDPR compliant", "Dutch team"],
    formTitle: "Schedule a Free Consultation",
    formSubtitle: "Tell us about your business.",
    labels: {
      name: "Name *",
      email: "Email *",
      company: "Company name",
      businessType: "Business type",
      goal: "What do you want to automate?",
      budget: "Budget indication",
    },
    placeholders: {
      name: "Your name",
      email: "you@email.com",
      company: "Your company",
      select: "Select...",
    },
    businessTypes: [
      "E-commerce / Online store",
      "Marketing & Communications",
      "Financial services",
      "Legal / Law firm",
      "IT & Software",
      "Healthcare",
      "Manufacturing & Logistics",
      "Hospitality & Retail",
      "Consulting",
      "Other",
    ],
    businessGoals: [
      "Generate & follow up leads",
      "Automate customer service",
      "Automate content creation",
      "Streamline internal processes",
      "Data analysis & reporting",
      "Sales support",
      "Social media management",
      "Other",
    ],
    budgetRanges: [
      "Starter (€497/month)",
      "Growth (€997/month)",
      "Enterprise (custom)",
      "Not sure yet",
    ],
    gdpr: "I agree to the processing of my data in accordance with the privacy policy. *",
    gdprError: "You must agree to the privacy policy.",
    submitError: "Something went wrong. Please try again.",
    submitting: "Submitting...",
    submitButton: "Schedule Free Consultation →",
    successTitle: "Thank you!",
    successMessage: "We'll get in touch within 24 hours.",
  },
} as const;

// ─── SERVICES ───────────────────────────────────────────────
export const servicesT = {
  nl: {
    sectionLabel: "Onze AI Agents",
    heading: (count: number) =>
      `Meer Dan ${count} Agent-Types. Eindeloze Mogelijkheden.`,
    subheading:
      "Elke klant krijgt een eigen beveiligde OpenClaw bot. Van klantenservice tot data-analyse, van leadgeneratie tot compliance monitoring. Op maat gebouwd met de beste technologie.",
    categories: [
      {
        category: "Klant & Communicatie",
        description:
          "Agents die klantcontact automatiseren en je bereikbaarheid verbeteren",
        agents: [
          {
            title: "Klantenservice Agent",
            description:
              "Automatisch klantberichten beantwoorden via email, chat, Slack of WhatsApp. Triageert op urgentie en escaleert complexe vragen naar een mens.",
            stats: "90% snellere reactietijd",
          },
          {
            title: "Voice Agent",
            description:
              "AI-gestuurd bellen en gespreksafhandeling. Inbound calls beantwoorden, outbound bellen voor afspraken en follow-ups. Menselijke spraakkwaliteit.",
            stats: "24/7 telefonisch bereikbaar",
          },
          {
            title: "Chatbot Agent",
            description:
              "Intelligente chatbot voor je website of app. Beantwoordt vragen, plant afspraken, kwalificeert leads en verwijst door. Getraind op jouw bedrijf.",
            stats: "80% vragen direct opgelost",
          },
          {
            title: "Helpdesk Agent",
            description:
              "Interne support automatiseren. Ticketsysteem beheren, FAQ beantwoorden voor medewerkers, IT-vragen triageren en kennisbank doorzoeken.",
            stats: "60% minder tickets",
          },
        ],
      },
      {
        category: "Marketing & Content",
        description:
          "Agents die je marketing automatiseren en content op schaal produceren",
        agents: [
          {
            title: "Content Agent",
            description:
              "Van 1 stuk content naar 10+ platformen. Blogposts, social media posts, nieuwsbrief en meer. Allemaal in jouw tone of voice.",
            stats: "300% meer content output",
          },
          {
            title: "SEO & AIO Agent",
            description:
              "Content die rankt bij Google en AI-zoekmachines (ChatGPT, Gemini, Perplexity). Keyword research, content gaps en technische SEO.",
            stats: "Gevonden door mens en AI",
          },
          {
            title: "Email Marketing Agent",
            description:
              "Welkomstflows, sales funnels, nieuwsbrieven en re-engagement campagnes. A/B testing op onderwerpregels. Hogere open rates.",
            stats: "Tot 53% hogere conversie",
          },
          {
            title: "Social Media Agent",
            description:
              "Posts maken, reacties beheren, engagement analyseren op LinkedIn, Instagram en X. Virale trend-detectie en concurrentie-analyse.",
            stats: "34% meer engagement",
          },
          {
            title: "Ads & Campaign Agent",
            description:
              "Google Ads, Meta Ads en LinkedIn Ads campagnes optimaliseren. Biedstrategieën aanpassen, budgetten herverdelen en rapporteren op ROI.",
            stats: "Lagere CPA, hoger ROAS",
          },
        ],
      },
      {
        category: "Sales & Leadgeneratie",
        description:
          "Agents die je salesproces versnellen en leads omzetten in klanten",
        agents: [
          {
            title: "Lead Generation Agent",
            description:
              "Automatisch leads vinden, kwalificeren en opvolgen. Scrape prospects, verrijk met data, en stuur persoonlijke outreach via email of LinkedIn.",
            stats: "3x meer gekwalificeerde leads",
          },
          {
            title: "Appointment Setter Agent",
            description:
              "Automatisch afspraken inplannen met prospects. Follow-up sequences, reminders en no-show opvolging. Integreert met je agenda.",
            stats: "2x meer geboekte calls",
          },
          {
            title: "E-commerce Agent",
            description:
              "Productbeschrijvingen genereren, prijzen monitoren, voorraad beheren en abandoned cart follow-ups. Upsell en cross-sell automatiseren.",
            stats: "28% hogere orderwaarde",
          },
        ],
      },
      {
        category: "Data & Operations",
        description:
          "Agents die je bedrijfsprocessen automatiseren en inzichten leveren",
        agents: [
          {
            title: "Automation Agent",
            description:
              "Workflows automatiseren tussen al je systemen. CRM, boekhouding, projectmanagement, e-commerce. Alles gekoppeld.",
            stats: "12+ uur per week bespaard",
          },
          {
            title: "Data & Analytics Agent",
            description:
              "Automatisch rapporten genereren, KPI-dashboards vullen, trends detecteren en anomalieën signaleren. Van ruwe data naar bruikbare inzichten.",
            stats: "Realtime business intelligence",
          },
          {
            title: "Data Entry & Processing Agent",
            description:
              "Documenten verwerken, facturen inlezen, formulieren digitaliseren, data invoeren en valideren. Van PDF naar database in seconden.",
            stats: "95% minder handmatig werk",
          },
          {
            title: "Compliance & Monitoring Agent",
            description:
              "GDPR-compliance monitoren, datakwaliteit controleren, beveiligingsrisico's signaleren en audits voorbereiden. Altijd up-to-date.",
            stats: "Continue compliance monitoring",
          },
          {
            title: "Web Scraping & Research Agent",
            description:
              "Concurrenten monitoren, marktdata verzamelen, prijzen vergelijken, reviews analyseren en trends signaleren. Geautomatiseerd marktonderzoek.",
            stats: "24/7 marktinzichten",
          },
          {
            title: "Custom AI Agent",
            description:
              "Heb je een uniek probleem? Wij bouwen een agent op maat. Van intern kennisbeheer tot specifieke industrie-workflows. Alles is mogelijk.",
            stats: "100% op maat gebouwd",
          },
        ],
      },
    ],
    ctaTitle: "Jouw OpenClaw bot staat er niet tussen?",
    ctaText:
      "Geen probleem. Wij bouwen elke AI agent die je kunt bedenken. Vertel ons je uitdaging en wij bouwen jouw unieke OpenClaw bot.",
    ctaButton: "Gratis Adviesgesprek Inplannen",
    jsonLdName: "AI Agent Diensten van NovaClaw",
    jsonLdDescription:
      "Custom AI agents voor bedrijven: klantenservice, voice, content, SEO, email marketing, social media, leadgeneratie, e-commerce, data analytics, workflow automation en meer.",
  },
  en: {
    sectionLabel: "Our AI Agents",
    heading: (count: number) =>
      `More Than ${count} Agent Types. Endless Possibilities.`,
    subheading:
      "Every client gets their own secure OpenClaw bot. From customer service to data analysis, from lead generation to compliance monitoring. Custom built with the best technology.",
    categories: [
      {
        category: "Customer & Communication",
        description:
          "Agents that automate customer interactions and improve your availability",
        agents: [
          {
            title: "Customer Service Agent",
            description:
              "Automatically answer customer messages via email, chat, Slack or WhatsApp. Triages by urgency and escalates complex questions to humans.",
            stats: "90% faster response time",
          },
          {
            title: "Voice Agent",
            description:
              "AI-powered calling and call handling. Answer inbound calls, make outbound calls for appointments and follow-ups. Human-like voice quality.",
            stats: "24/7 phone availability",
          },
          {
            title: "Chatbot Agent",
            description:
              "Intelligent chatbot for your website or app. Answers questions, schedules appointments, qualifies leads and refers. Trained on your business.",
            stats: "80% of questions resolved instantly",
          },
          {
            title: "Helpdesk Agent",
            description:
              "Automate internal support. Manage ticket systems, answer FAQs for employees, triage IT questions and search knowledge bases.",
            stats: "60% fewer tickets",
          },
        ],
      },
      {
        category: "Marketing & Content",
        description:
          "Agents that automate your marketing and produce content at scale",
        agents: [
          {
            title: "Content Agent",
            description:
              "From 1 piece of content to 10+ platforms. Blog posts, social media posts, newsletters and more. All in your tone of voice.",
            stats: "300% more content output",
          },
          {
            title: "SEO & AIO Agent",
            description:
              "Content that ranks on Google and AI search engines (ChatGPT, Gemini, Perplexity). Keyword research, content gaps and technical SEO.",
            stats: "Found by humans and AI",
          },
          {
            title: "Email Marketing Agent",
            description:
              "Welcome flows, sales funnels, newsletters and re-engagement campaigns. A/B testing on subject lines. Higher open rates.",
            stats: "Up to 53% higher conversion",
          },
          {
            title: "Social Media Agent",
            description:
              "Create posts, manage reactions, analyze engagement on LinkedIn, Instagram and X. Viral trend detection and competitor analysis.",
            stats: "34% more engagement",
          },
          {
            title: "Ads & Campaign Agent",
            description:
              "Optimize Google Ads, Meta Ads and LinkedIn Ads campaigns. Adjust bidding strategies, redistribute budgets and report on ROI.",
            stats: "Lower CPA, higher ROAS",
          },
        ],
      },
      {
        category: "Sales & Lead Generation",
        description:
          "Agents that accelerate your sales process and convert leads into customers",
        agents: [
          {
            title: "Lead Generation Agent",
            description:
              "Automatically find, qualify and follow up leads. Scrape prospects, enrich with data, and send personalized outreach via email or LinkedIn.",
            stats: "3x more qualified leads",
          },
          {
            title: "Appointment Setter Agent",
            description:
              "Automatically schedule appointments with prospects. Follow-up sequences, reminders and no-show follow-up. Integrates with your calendar.",
            stats: "2x more booked calls",
          },
          {
            title: "E-commerce Agent",
            description:
              "Generate product descriptions, monitor prices, manage inventory and abandoned cart follow-ups. Automate upsell and cross-sell.",
            stats: "28% higher order value",
          },
        ],
      },
      {
        category: "Data & Operations",
        description:
          "Agents that automate your business processes and deliver insights",
        agents: [
          {
            title: "Automation Agent",
            description:
              "Automate workflows between all your systems. CRM, accounting, project management, e-commerce. Everything connected.",
            stats: "12+ hours saved per week",
          },
          {
            title: "Data & Analytics Agent",
            description:
              "Automatically generate reports, fill KPI dashboards, detect trends and flag anomalies. From raw data to actionable insights.",
            stats: "Real-time business intelligence",
          },
          {
            title: "Data Entry & Processing Agent",
            description:
              "Process documents, read invoices, digitize forms, enter and validate data. From PDF to database in seconds.",
            stats: "95% less manual work",
          },
          {
            title: "Compliance & Monitoring Agent",
            description:
              "Monitor GDPR compliance, check data quality, flag security risks and prepare audits. Always up to date.",
            stats: "Continuous compliance monitoring",
          },
          {
            title: "Web Scraping & Research Agent",
            description:
              "Monitor competitors, collect market data, compare prices, analyze reviews and flag trends. Automated market research.",
            stats: "24/7 market insights",
          },
          {
            title: "Custom AI Agent",
            description:
              "Have a unique challenge? We build a custom agent. From internal knowledge management to specific industry workflows. Anything is possible.",
            stats: "100% custom built",
          },
        ],
      },
    ],
    ctaTitle: "Don't see your OpenClaw bot?",
    ctaText:
      "No problem. We build any AI agent you can think of. Tell us your challenge and we'll build your unique OpenClaw bot.",
    ctaButton: "Schedule Free Consultation",
    jsonLdName: "AI Agent Services by NovaClaw",
    jsonLdDescription:
      "Custom AI agents for businesses: customer service, voice, content, SEO, email marketing, social media, lead generation, e-commerce, data analytics, workflow automation and more.",
  },
} as const;

// ─── TECH STACK ─────────────────────────────────────────────
export const techStackT = {
  nl: {
    label: "Technologie-Agnostisch",
    heading: "Wij kiezen per project de optimale AI-technologie",
    techs: [
      { name: "OpenAI", subtitle: "GPT-4o", description: "Geavanceerde taalmodellen" },
      { name: "Anthropic", subtitle: "Claude", description: "Veilige AI-assistenten" },
      { name: "Google", subtitle: "Gemini", description: "Multimodale AI" },
      { name: "Meta", subtitle: "Llama", description: "Open-source modellen" },
    ],
    footer:
      "Wij zijn niet gebonden aan een leverancier. Voor elk project selecteren wij het AI-model dat de beste resultaten levert voor jouw specifieke use case. Van GPT-4o voor complexe redeneertaken tot Gemini voor multimodale analyse.",
  },
  en: {
    label: "Technology Agnostic",
    heading: "We choose the optimal AI technology per project",
    techs: [
      { name: "OpenAI", subtitle: "GPT-4o", description: "Advanced language models" },
      { name: "Anthropic", subtitle: "Claude", description: "Safe AI assistants" },
      { name: "Google", subtitle: "Gemini", description: "Multimodal AI" },
      { name: "Meta", subtitle: "Llama", description: "Open-source models" },
    ],
    footer:
      "We are not bound to any vendor. For each project we select the AI model that delivers the best results for your specific use case. From GPT-4o for complex reasoning to Gemini for multimodal analysis.",
  },
} as const;

// ─── RESULTS ────────────────────────────────────────────────
export const resultsT = {
  nl: {
    sectionLabel: "Bewezen Resultaten",
    heading: "Wat AI Agents Opleveren",
    subheading:
      "Geen vage beloftes. Dit zijn concrete resultaten die bedrijven behalen met custom AI agents.",
    cards: [
      { metric: "90%", label: "Snellere reactietijd", detail: "Van 30 min naar 3 min op klantberichten" },
      { metric: "300%", label: "Meer content output", detail: "Van 1 stuk content naar 10+ platformen" },
      { metric: "12+ uur", label: "Per week bespaard", detail: "Tijd die terugkomt voor je kerntaken" },
      { metric: "53%", label: "Hogere conversie", detail: "Door slimmere, gepersonaliseerde opvolging" },
    ],
    quoteStart: "Bedrijven die AI agents inzetten besparen gemiddeld",
    quoteHighlight: "12-20 uur per week",
    quoteEnd: "op repetitieve taken. Die tijd investeren ze in groei, klantrelaties en strategie.",
    quoteSource: "Gebaseerd op marktonderzoek 2025-2026",
  },
  en: {
    sectionLabel: "Proven Results",
    heading: "What AI Agents Deliver",
    subheading:
      "No vague promises. These are concrete results businesses achieve with custom AI agents.",
    cards: [
      { metric: "90%", label: "Faster response time", detail: "From 30 min to 3 min on customer messages" },
      { metric: "300%", label: "More content output", detail: "From 1 piece of content to 10+ platforms" },
      { metric: "12+ hrs", label: "Saved per week", detail: "Time freed up for your core tasks" },
      { metric: "53%", label: "Higher conversion", detail: "Through smarter, personalized follow-up" },
    ],
    quoteStart: "Businesses using AI agents save an average of",
    quoteHighlight: "12-20 hours per week",
    quoteEnd: "on repetitive tasks. They invest that time in growth, customer relationships and strategy.",
    quoteSource: "Based on market research 2025-2026",
  },
} as const;

// ─── HOW IT WORKS ───────────────────────────────────────────
export const howItWorksT = {
  nl: {
    sectionLabel: "Ons Proces",
    heading: "Hoe Het Werkt",
    steps: [
      { title: "Kennismakingsgesprek", description: "We bespreken jouw doelen, doelgroep en contentbehoeften." },
      { title: "Wij bouwen jouw OpenClaw bot", description: "Ons team bouwt een beveiligde AI agent, volledig op maat." },
      { title: "Launch & Beheer", description: "Je agents gaan live! Wij monitoren en optimaliseren." },
    ],
  },
  en: {
    sectionLabel: "Our Process",
    heading: "How It Works",
    steps: [
      { title: "Discovery Call", description: "We discuss your goals, target audience and content needs." },
      { title: "We Build Your OpenClaw Bot", description: "Our team builds a secure AI agent, fully tailored to you." },
      { title: "Launch & Manage", description: "Your agents go live! We monitor and optimize." },
    ],
  },
} as const;

// ─── WHAT YOU GET ───────────────────────────────────────────
export const whatYouGetT = {
  nl: {
    sectionLabel: "Alles Inbegrepen",
    heading: "Wat Je Krijgt",
    features: [
      { title: "Jouw eigen OpenClaw bot", description: "Een beveiligde AI agent, volledig getraind op jouw merk, data en doelgroep." },
      { title: "Automatische content", description: "Van LinkedIn posts tot blogs, 24/7 kwalitatieve content." },
      { title: "Multi-Platform", description: "Automatisch publiceren op alle kanalen." },
      { title: "Performance Dashboard", description: "Real-time inzicht in wat werkt." },
      { title: "Veilig & Compliant", description: "Privacy-first met enterprise-grade beveiliging." },
      { title: "Dedicated Support", description: "Persoonlijke begeleiding, geen chatbots." },
    ],
  },
  en: {
    sectionLabel: "Everything Included",
    heading: "What You Get",
    features: [
      { title: "Your own OpenClaw bot", description: "A secure AI agent, fully trained on your brand, data and target audience." },
      { title: "Automated content", description: "From LinkedIn posts to blogs, 24/7 quality content." },
      { title: "Multi-Platform", description: "Automatically publish across all channels." },
      { title: "Performance Dashboard", description: "Real-time insight into what works." },
      { title: "Secure & Compliant", description: "Privacy-first with enterprise-grade security." },
      { title: "Dedicated Support", description: "Personal guidance, no chatbots." },
    ],
  },
} as const;

// ─── PRICING ────────────────────────────────────────────────
export const pricingT = {
  nl: {
    sectionLabel: "Transparante Prijzen",
    heading: "Kies Jouw Plan",
    subheading: "Geen verrassingen. Maandelijks opzegbaar. Kies je eigen agents.",
    popularBadge: "Meest Gekozen",
    ctaButton: "Start Gesprek",
    agentTypesLabel: "Meer dan 18 beschikbare agent-types voor alle pakketten:",
    plans: [
      {
        name: "Starter",
        price: "497",
        period: "/maand",
        description: "Perfect om te starten met AI",
        features: [
          "1 Custom AI Agent naar keuze",
          "Keuze uit meer dan 18 agent-types (bijv. Klantenservice, Content, Voice, SEO)",
          "1 Platform integratie",
          "Tot 20 geautomatiseerde acties/maand",
          "Email support",
          "Maandelijkse optimalisatie",
        ],
      },
      {
        name: "Growth",
        price: "997",
        period: "/maand",
        description: "Voor bedrijven die serieus willen opschalen",
        features: [
          "3 Custom AI Agents naar keuze",
          "Mix & match uit meer dan 18 agent-types",
          "Alle platforms geintegreerd",
          "Onbeperkte acties",
          "Priority support",
          "Wekelijkse optimalisatie",
          "Performance dashboard",
          "A/B testing",
        ],
      },
      {
        name: "Enterprise",
        price: "Op maat",
        period: "",
        description: "Voor organisaties met complexe behoeften",
        features: [
          "Onbeperkte AI Agents",
          "Alle agent-types beschikbaar (meer dan 18)",
          "Custom integraties & workflows",
          "Dedicated account manager",
          "24/7 support",
          "Dagelijkse optimalisatie",
          "Custom AI model fine-tuning",
          "SLA garantie",
        ],
      },
    ],
    agentTypes: [
      "Klantenservice", "Voice", "Chatbot", "Helpdesk", "Content", "SEO & AIO",
      "Email Marketing", "Social Media", "Ads & Campaigns", "Lead Generation",
      "Appointment Setter", "E-commerce", "Automation", "Data & Analytics",
      "Data Entry", "Compliance", "Web Scraping", "Custom Agent",
    ],
  },
  en: {
    sectionLabel: "Transparent Pricing",
    heading: "Choose Your Plan",
    subheading: "No surprises. Cancel monthly. Choose your own agents.",
    popularBadge: "Most Popular",
    ctaButton: "Get Started",
    agentTypesLabel: "More than 18 available agent types for all plans:",
    plans: [
      {
        name: "Starter",
        price: "497",
        period: "/month",
        description: "Perfect to start with AI",
        features: [
          "1 Custom AI Agent of your choice",
          "Choose from more than 18 agent types (e.g. Customer Service, Content, Voice, SEO)",
          "1 Platform integration",
          "Up to 20 automated actions/month",
          "Email support",
          "Monthly optimization",
        ],
      },
      {
        name: "Growth",
        price: "997",
        period: "/month",
        description: "For businesses ready to scale",
        features: [
          "3 Custom AI Agents of your choice",
          "Mix & match from more than 18 agent types",
          "All platforms integrated",
          "Unlimited actions",
          "Priority support",
          "Weekly optimization",
          "Performance dashboard",
          "A/B testing",
        ],
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For organizations with complex needs",
        features: [
          "Unlimited AI Agents",
          "All agent types available (more than 18)",
          "Custom integrations & workflows",
          "Dedicated account manager",
          "24/7 support",
          "Daily optimization",
          "Custom AI model fine-tuning",
          "SLA guarantee",
        ],
      },
    ],
    agentTypes: [
      "Customer Service", "Voice", "Chatbot", "Helpdesk", "Content", "SEO & AIO",
      "Email Marketing", "Social Media", "Ads & Campaigns", "Lead Generation",
      "Appointment Setter", "E-commerce", "Automation", "Data & Analytics",
      "Data Entry", "Compliance", "Web Scraping", "Custom Agent",
    ],
  },
} as const;

// ─── ABOUT ──────────────────────────────────────────────────
export const aboutT = {
  nl: {
    sectionLabel: "Over NovaClaw",
    heading: "Nederlands Bureau voor AI Agents",
    description:
      "NovaClaw is opgericht met een duidelijke missie: AI-technologie toegankelijk maken voor elk bedrijf in Nederland. Wij geloven dat je geen groot IT-team nodig hebt om te profiteren van kunstmatige intelligentie. Ons team bouwt, test en beheert custom AI agents zodat jij je kunt focussen op wat je het beste doet: ondernemen.",
    features: [
      { title: "100% Op Maat", description: "Geen standaard templates. Elke AI agent wordt specifiek gebouwd voor jouw bedrijf, merk en doelgroep. Unieke oplossingen voor unieke uitdagingen." },
      { title: "Privacy & Veiligheid", description: "Volledig GDPR-compliant met dataverwerking binnen de EU. Enterprise-grade beveiliging en encryptie. Jouw data blijft van jou." },
      { title: "Nederlands Team", description: "Persoonlijke begeleiding in het Nederlands. Geen chatbot-support maar echte mensen die jouw business begrijpen en meedenken." },
    ],
  },
  en: {
    sectionLabel: "About NovaClaw",
    heading: "Dutch Agency for AI Agents",
    description:
      "NovaClaw was founded with a clear mission: making AI technology accessible for every business. We believe you don't need a large IT team to benefit from artificial intelligence. Our team builds, tests and manages custom AI agents so you can focus on what you do best: running your business.",
    features: [
      { title: "100% Custom Built", description: "No standard templates. Every AI agent is specifically built for your business, brand and target audience. Unique solutions for unique challenges." },
      { title: "Privacy & Security", description: "Fully GDPR-compliant with data processing within the EU. Enterprise-grade security and encryption. Your data stays yours." },
      { title: "Dutch Team", description: "Personal guidance in your language. No chatbot support but real people who understand your business and think along." },
    ],
  },
} as const;

// ─── FAQ ────────────────────────────────────────────────────
export const faqT = {
  nl: {
    sectionLabel: "Veelgestelde Vragen",
    heading: "Alles wat je wilt weten",
    items: [
      { q: "Wat zijn AI agents en wat kunnen ze voor mijn bedrijf doen?", a: "AI agents zijn autonome software-assistenten die specifieke taken uitvoeren voor jouw bedrijf. Denk aan het automatisch genereren van social media content, het beantwoorden van klantvragen, het analyseren van markttrends, of het opvolgen van leads. Ze werken 24/7, maken geen fouten door vermoeidheid, en schalen mee met je bedrijf." },
      { q: "Moet ik technische kennis hebben om met NovaClaw te werken?", a: "Nee, helemaal niet. NovaClaw is een full-service agency. Wij bouwen, configureren en beheren alles voor je. Jij vertelt ons wat je wilt bereiken, en wij zorgen dat de AI agents dat realiseren. Je hoeft zelf geen code te schrijven of technische beslissingen te nemen." },
      { q: "Hoe lang duurt het voordat mijn AI agents live gaan?", a: "Na het kennismakingsgesprek bouwen wij jouw custom agents binnen 1-2 weken. We testen uitgebreid voordat we live gaan. Daarna optimaliseren we wekelijks of dagelijks, afhankelijk van je pakket." },
      { q: "Wat kost het en kan ik maandelijks opzeggen?", a: "Onze pakketten starten vanaf \u20ac497 per maand voor 1 custom AI agent. Het Growth-pakket (\u20ac997/maand) is het meest gekozen en bevat 3 agents met onbeperkte acties. Alle pakketten zijn maandelijks opzegbaar, geen lange contracten." },
      { q: "Zijn mijn gegevens veilig bij NovaClaw?", a: "Absoluut. We zijn volledig GDPR-compliant en verwerken alle data binnen de EU. We gebruiken enterprise-grade beveiliging met encryptie. Jouw data wordt nooit gedeeld met derden en je behoudt altijd volledige eigendom over je content en gegevens." },
      { q: "Welke AI agents bieden jullie aan?", a: "Wij bieden meer dan 18 typen AI agents in 4 categorieen. Klant & Communicatie: Klantenservice Agent, Voice Agent, Chatbot Agent en Helpdesk Agent. Marketing & Content: Content Agent, SEO & AIO Agent, Email Marketing Agent, Social Media Agent en Ads & Campaign Agent. Sales & Leadgeneratie: Lead Generation Agent, Appointment Setter Agent en E-commerce Agent. Data & Operations: Automation Agent, Data & Analytics Agent, Data Entry Agent, Compliance Agent, Web Scraping Agent en Custom AI Agent. Heb je een uniek probleem? Wij bouwen elke agent die je kunt bedenken." },
      { q: "Welke AI-technologie gebruiken jullie?", a: "Wij zijn tech-agnostisch en werken met de beste AI-modellen: OpenAI (GPT-4o), Anthropic Claude, Google Gemini en Meta Llama. Per project kiezen wij de technologie die de beste resultaten levert voor jouw specifieke use case. Je bent dus nooit gebonden aan een leverancier." },
      { q: "Welke platforms ondersteunen jullie?", a: "We integreren met alle gangbare platforms: LinkedIn, Instagram, Twitter/X, Facebook, je website, email marketing tools, CRM-systemen en meer. Bij het Enterprise-pakket bouwen we ook custom integraties voor specifieke software die je gebruikt." },
      { q: "Wat is het verschil tussen NovaClaw en een chatbot zoals ChatGPT?", a: "ChatGPT is een generieke AI-tool die jij zelf moet aansturen. NovaClaw bouwt gespecialiseerde AI agents die autonoom taken uitvoeren, specifiek getraind op jouw merk, doelgroep en doelen. Bovendien werken wij niet met een enkel AI-model maar kiezen per taak het beste model (OpenAI, Claude, Gemini). Het verschil is als een universeel zakmes versus een compleet op maat gemaakt professioneel gereedschap." },
      { q: "Hoe kan ik contact opnemen met NovaClaw?", a: "Je kunt direct een gratis kennismakingsgesprek inplannen via het formulier bovenaan deze pagina. Je kunt ook mailen naar info@novaclaw.tech. We reageren altijd binnen 24 uur op werkdagen." },
      { q: "Kan ik de AI agents eerst uitproberen?", a: "Ja! We bieden een gratis kennismakingsgesprek aan waarin we jouw situatie bespreken en een concreet voorstel doen. Je ziet precies wat de agents voor jou gaan doen voordat je beslist. Bovendien is alles maandelijks opzegbaar, dus je zit nergens aan vast." },
      { q: "Voor welke bedrijven is NovaClaw geschikt?", a: "NovaClaw is geschikt voor elk bedrijf dat wil groeien met AI: van startups en MKB tot grote organisaties. We werken met e-commerce bedrijven, marketingbureaus, IT-bedrijven, financiele dienstverleners, gezondheidszorg en meer. Als je repetitieve taken hebt die je wilt automatiseren, kunnen wij helpen." },
    ],
  },
  en: {
    sectionLabel: "Frequently Asked Questions",
    heading: "Everything you want to know",
    items: [
      { q: "What are AI agents and what can they do for my business?", a: "AI agents are autonomous software assistants that perform specific tasks for your business. Think of automatically generating social media content, answering customer questions, analyzing market trends, or following up on leads. They work 24/7, don't make mistakes from fatigue, and scale with your business." },
      { q: "Do I need technical knowledge to work with NovaClaw?", a: "No, not at all. NovaClaw is a full-service agency. We build, configure and manage everything for you. You tell us what you want to achieve, and we make sure the AI agents deliver it. You don't need to write code or make technical decisions yourself." },
      { q: "How long before my AI agents go live?", a: "After the discovery call, we build your custom agents within 1-2 weeks. We test extensively before going live. After that, we optimize weekly or daily, depending on your plan." },
      { q: "What does it cost and can I cancel monthly?", a: "Our plans start from \u20ac497 per month for 1 custom AI agent. The Growth plan (\u20ac997/month) is the most popular and includes 3 agents with unlimited actions. All plans are cancelable monthly, no long-term contracts." },
      { q: "Is my data safe with NovaClaw?", a: "Absolutely. We are fully GDPR-compliant and process all data within the EU. We use enterprise-grade security with encryption. Your data is never shared with third parties and you always retain full ownership of your content and data." },
      { q: "Which AI agents do you offer?", a: "We offer more than 18 types of AI agents in 4 categories. Customer & Communication: Customer Service Agent, Voice Agent, Chatbot Agent and Helpdesk Agent. Marketing & Content: Content Agent, SEO & AIO Agent, Email Marketing Agent, Social Media Agent and Ads & Campaign Agent. Sales & Lead Generation: Lead Generation Agent, Appointment Setter Agent and E-commerce Agent. Data & Operations: Automation Agent, Data & Analytics Agent, Data Entry Agent, Compliance Agent, Web Scraping Agent and Custom AI Agent. Have a unique challenge? We build any agent you can think of." },
      { q: "What AI technology do you use?", a: "We are tech-agnostic and work with the best AI models: OpenAI (GPT-4o), Anthropic Claude, Google Gemini and Meta Llama. For each project we choose the technology that delivers the best results for your specific use case. You are never bound to a single vendor." },
      { q: "Which platforms do you support?", a: "We integrate with all common platforms: LinkedIn, Instagram, Twitter/X, Facebook, your website, email marketing tools, CRM systems and more. With the Enterprise plan, we also build custom integrations for specific software you use." },
      { q: "What's the difference between NovaClaw and a chatbot like ChatGPT?", a: "ChatGPT is a generic AI tool that you need to operate yourself. NovaClaw builds specialized AI agents that autonomously perform tasks, specifically trained on your brand, audience and goals. Moreover, we don't work with a single AI model but choose the best model per task (OpenAI, Claude, Gemini). The difference is like a universal Swiss army knife versus a completely custom-built professional toolset." },
      { q: "How can I contact NovaClaw?", a: "You can schedule a free discovery call directly via the form at the top of this page. You can also email info@novaclaw.tech. We always respond within 24 hours on business days." },
      { q: "Can I try the AI agents first?", a: "Yes! We offer a free discovery call where we discuss your situation and make a concrete proposal. You'll see exactly what the agents will do for you before you decide. Plus, everything is cancelable monthly, so you're never locked in." },
      { q: "Which businesses is NovaClaw suitable for?", a: "NovaClaw is suitable for any business that wants to grow with AI: from startups and SMBs to large organizations. We work with e-commerce companies, marketing agencies, IT companies, financial services, healthcare and more. If you have repetitive tasks you want to automate, we can help." },
    ],
  },
} as const;

// ─── FOOTER ─────────────────────────────────────────────────
export const footerT = {
  nl: {
    description:
      "Nederlands bureau dat custom AI-agents bouwt voor bedrijven. Meer dan 18 agent-types. Wij bouwen, jij groeit.",
    location: "Nederland",
    colKlantSales: "Klant & Sales",
    colMarketingData: "Marketing & Data",
    colOperations: "Operations",
    colResources: "Resources",
    colBlog: "Blog Artikelen",
    resources: [
      { label: "Blog & Kennisbank", href: "/blog" },
      { label: "Veelgestelde Vragen", href: "/#faq" },
      { label: "Hoe het werkt", href: "/#hoe-het-werkt" },
      { label: "Resultaten & ROI", href: "/#resultaten" },
      { label: "Prijzen & Pakketten", href: "/#prijzen" },
    ],
    blogLinks: [
      { label: "Wat zijn AI Agents?", href: "/blog/wat-zijn-ai-agents" },
      { label: "AIO vs SEO Uitgelegd", href: "/blog/aio-vs-seo-verschil" },
      { label: "6 AI Agents voor MKB", href: "/blog/6-ai-agents-voor-mkb" },
    ],
    trustBadges: [
      "GDPR Compliant",
      "Data Verwerking in EU",
      "Maandelijks Opzegbaar",
      "100% Op Maat Gebouwd",
      "Tech-Agnostisch",
    ],
    copyright: (year: number) =>
      `\u00a9 ${year} NovaClaw AI. Alle rechten voorbehouden.`,
  },
  en: {
    description:
      "Dutch agency building custom AI agents for businesses. More than 18 agent types. We build, you grow.",
    location: "The Netherlands",
    colKlantSales: "Customer & Sales",
    colMarketingData: "Marketing & Data",
    colOperations: "Operations",
    colResources: "Resources",
    colBlog: "Blog Articles",
    resources: [
      { label: "Blog & Knowledge Base", href: "/blog" },
      { label: "Frequently Asked Questions", href: "/#faq" },
      { label: "How it works", href: "/#hoe-het-werkt" },
      { label: "Results & ROI", href: "/#resultaten" },
      { label: "Pricing & Plans", href: "/#prijzen" },
    ],
    blogLinks: [
      { label: "What Are AI Agents?", href: "/blog/what-are-ai-agents" },
      { label: "AIO vs SEO Explained", href: "/blog/aio-vs-seo-difference" },
      { label: "6 AI Agents for Business", href: "/blog/6-ai-agents-every-business-needs" },
    ],
    trustBadges: [
      "GDPR Compliant",
      "EU Data Processing",
      "Cancel Monthly",
      "100% Custom Built",
      "Tech-Agnostic",
    ],
    copyright: (year: number) =>
      `\u00a9 ${year} NovaClaw AI. All rights reserved.`,
  },
} as const;

// ─── AGENT CHAT ─────────────────────────────────────────────
export const agentChatT = {
  nl: {
    greeting: "Hoi! Ik ben Nova, de AI-assistent van NovaClaw. Hoe kan ik je helpen?",
    placeholder: "Stel een vraag...",
    errorMessage: "Er ging iets mis.",
    online: "Online",
  },
  en: {
    greeting: "Hi! I'm Nova, NovaClaw's AI assistant. How can I help you?",
    placeholder: "Ask a question...",
    errorMessage: "Something went wrong.",
    online: "Online",
  },
} as const;

// ─── BLOG PAGE ──────────────────────────────────────────────
export const blogPageT = {
  nl: {
    backToHome: "Terug naar home",
    heading: "Blog & Kennisbank",
    subheading:
      "De laatste inzichten over AI agents, AIO optimalisatie en marketing automation voor bedrijven.",
    nlSection: "Nederlands",
    enSection: "English",
    articleCount: (count: number) => `${count} artikelen`,
    noArticles: "Nog geen artikelen gepubliceerd. Kom binnenkort terug!",
    ctaHeading: "Wil je AI agents voor jouw bedrijf?",
    ctaText:
      "Plan een gratis kennismakingsgesprek en ontdek wat NovaClaw voor jou kan betekenen.",
    ctaButton: "Plan Gratis Gesprek",
  },
  en: {
    backToHome: "Back to home",
    heading: "Blog & Knowledge Base",
    subheading:
      "The latest insights on AI agents, AIO optimization and marketing automation for businesses.",
    nlSection: "Nederlands",
    enSection: "English",
    articleCount: (count: number) => `${count} articles`,
    noArticles: "No articles published yet. Check back soon!",
    ctaHeading: "Want AI agents for your business?",
    ctaText:
      "Schedule a free consultation and discover what NovaClaw can do for you.",
    ctaButton: "Schedule Free Consultation",
  },
} as const;

// ─── BLOG POST ──────────────────────────────────────────────
export const blogPostT = {
  nl: {
    backToBlog: "Terug naar blog",
    translationAvailable: "Dit artikel is ook beschikbaar in het Engels",
    readTranslation: "Read in English \u2192",
    authorBio:
      "Het NovaClaw team schrijft over AI agents, AIO en marketing automation.",
    ctaHeading: "Wil je AI agents voor jouw bedrijf?",
    ctaText:
      "Plan een gratis kennismakingsgesprek en ontdek wat NovaClaw voor jou kan betekenen.",
    ctaButton: "Plan Gratis Gesprek",
    notFound: "Niet gevonden",
  },
  en: {
    backToBlog: "Back to blog",
    translationAvailable: "This article is also available in Dutch",
    readTranslation: "Lees in het Nederlands \u2192",
    authorBio:
      "The NovaClaw team writes about AI agents, AIO and marketing automation.",
    ctaHeading: "Want AI agents for your business?",
    ctaText:
      "Schedule a free consultation and discover what NovaClaw can do for you.",
    ctaButton: "Schedule Free Consultation",
    notFound: "Not found",
  },
} as const;

// ─── ROI CALCULATOR PAGE ────────────────────────────────────
export const roiCalcPageT = {
  nl: {
    title: "Gratis AI Agent ROI Calculator | NovaClaw AI",
    description:
      "Bereken hoeveel je bespaart met AI agents. Gratis ROI calculator: zie direct je maandelijkse besparing, terugverdientijd en aanbevolen plan.",
    heading: "Hoeveel bespaar je met AI agents?",
    subheading: "Bereken gratis hoeveel je bespaart met custom AI agents",
    backToHome: "Terug naar home",
    bottomCtaHeading: "Klaar om te starten met AI agents?",
    bottomCtaText:
      "Plan een gratis kennismakingsgesprek en ontdek wat NovaClaw voor jou kan betekenen.",
    bottomCtaButton: "Plan Gratis Gesprek",
  },
  en: {
    title: "Free AI Agent ROI Calculator | NovaClaw AI",
    description:
      "Calculate how much you save with AI agents. Free ROI calculator: see your monthly savings, payback period and recommended plan instantly.",
    heading: "How much do you save with AI agents?",
    subheading: "Calculate for free how much you save with custom AI agents",
    backToHome: "Back to home",
    bottomCtaHeading: "Ready to start with AI agents?",
    bottomCtaText:
      "Schedule a free consultation and discover what NovaClaw can do for you.",
    bottomCtaButton: "Schedule Free Consultation",
  },
} as const;
