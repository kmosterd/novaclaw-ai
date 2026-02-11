export interface BlogPost {
  slug: string;
  lang: "nl" | "en";
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  author: string;
  readingTime: string;
  featuredImage?: string;
  /** Slug of the translated version */
  translationSlug?: string;
  /** Whether this post comes from Supabase (dynamic) */
  isDynamic?: boolean;
}

export const blogPosts: BlogPost[] = [
  // ============================================================
  // ARTICLE 1: Wat zijn AI agents (NL)
  // ============================================================
  {
    slug: "wat-zijn-ai-agents",
    lang: "nl",
    title: "Wat Zijn AI Agents? De Ultieme Gids voor Bedrijven in 2026",
    description:
      "Alles wat je moet weten over AI agents: wat ze zijn, hoe ze werken, en hoe ze jouw bedrijf kunnen automatiseren. Inclusief concrete voorbeelden en ROI-berekening.",
    category: "AI Uitleg",
    tags: ["AI agents", "automatisering", "MKB", "uitleg"],
    publishedAt: "2026-02-10",
    updatedAt: "2026-02-10",
    author: "NovaClaw AI Team",
    readingTime: "8 min",
    translationSlug: "what-are-ai-agents",
    content: `## Wat zijn AI agents precies?

Een AI agent is een autonoom stuk software dat taken uitvoert namens jou. In tegenstelling tot een gewone chatbot die alleen antwoorden geeft, kan een AI agent daadwerkelijk actie ondernemen: emails versturen, data analyseren, content creeren, klanten opvolgen en workflows automatiseren.

Denk aan een AI agent als een digitale medewerker die 24 uur per dag werkt, nooit ziek is, en steeds beter wordt in zijn taken.

## Hoe werkt een AI agent?

AI agents combineren drie kerncomponenten:

**1. Taalmodel (LLM)** — Het "brein" van de agent. Dit kan OpenAI GPT-4o, Anthropic Claude, Google Gemini of Meta Llama zijn. Het model begrijpt instructies en genereert intelligente output.

**2. Tools en integraties** — De "handen" van de agent. Via API-koppelingen kan de agent acties uitvoeren: emails sturen via je mailsysteem, posts plaatsen op social media, data opslaan in je CRM.

**3. Geheugen en context** — Het "geheugen" van de agent. De agent onthoudt eerdere gesprekken, klantvoorkeuren en projectdetails. Dit maakt de output steeds relevanter.

## 6 typen AI agents voor bedrijven

### Klantenservice Agent
Beantwoordt automatisch klantberichten via email, chat of Slack. Triageert op urgentie en escaleert complexe vragen naar een mens. Gemiddeld resultaat: 90% snellere reactietijd.

### Content Agent
Neemt een stuk content (blogpost, podcast, video) en maakt er 10+ variaties van voor verschillende platformen. LinkedIn posts, tweets, nieuwsbrieven — allemaal in jouw tone of voice.

### SEO & AIO Agent
Maakt content die rankt bij Google en AI-zoekmachines zoals ChatGPT, Gemini en Perplexity. Doet keyword research, analyseert concurrentie en identificeert content gaps.

### Email Marketing Agent
Schrijft complete email sequences: welkomstflows, abandoned cart series, nieuwsbrieven. Met A/B testing op onderwerpregels. Resultaat: tot 53% hogere conversie.

### Social Media Agent
Beheert je social media: posts maken, reageren op comments, engagement analyseren. Detecteert virale trends en past strategie aan. Gemiddeld 34% meer engagement.

### Automation Agent
Koppelt al je systemen aan elkaar: CRM, boekhouding, projectmanagement, e-commerce. Automatiseert repetitieve workflows. Bespaart gemiddeld 12+ uur per week.

## Wat kost een AI agent?

De kosten variëren afhankelijk van complexiteit:

- **Starter**: vanaf €497/maand voor 1 custom AI agent
- **Growth**: €997/maand voor 3 agents met onbeperkte acties
- **Enterprise**: op maat voor grote organisaties

De ROI is doorgaans snel positief. Een bedrijf dat 12 uur per week bespaart op een uurtarief van €75, verdient de investering binnen de eerste week terug.

## AI agents vs. ChatGPT: wat is het verschil?

ChatGPT is een generieke AI-tool die jij handmatig moet aansturen. Je typt een prompt, krijgt een antwoord, en moet zelf actie ondernemen.

Een AI agent daarentegen:
- Werkt autonoom zonder dat jij iets hoeft te doen
- Is getraind op jouw specifieke bedrijf, merk en doelgroep
- Kan daadwerkelijk acties uitvoeren (emails sturen, posts plaatsen)
- Wordt continu geoptimaliseerd door experts
- Gebruikt het beste AI-model per taak (niet gebonden aan OpenAI)

## Hoe begin je met AI agents?

De eenvoudigste manier is samenwerken met een gespecialiseerd bureau. NovaClaw bouwt, test en beheert custom AI agents voor Nederlandse bedrijven. Het proces:

1. **Gratis kennismakingsgesprek** — We bespreken jouw doelen en uitdagingen
2. **Wij bouwen** — Ons team ontwikkelt jouw custom agents binnen 1-2 weken
3. **Launch en beheer** — De agents gaan live en wij optimaliseren continu

Je hoeft zelf geen technische kennis te hebben. Wij doen al het werk.

## Conclusie

AI agents zijn de volgende stap in bedrijfsautomatisering. Ze gaan verder dan chatbots door daadwerkelijk taken uit te voeren. Of je nu klantenservice wilt versnellen, content wilt opschalen, of workflows wilt automatiseren — er is een AI agent voor.

De bedrijven die nu beginnen met AI agents bouwen een voorsprong die moeilijk in te halen is. De vraag is niet of je AI agents gaat inzetten, maar wanneer.`,
  },

  // ============================================================
  // ARTICLE 1: What are AI agents (EN)
  // ============================================================
  {
    slug: "what-are-ai-agents",
    lang: "en",
    title: "What Are AI Agents? The Ultimate Guide for Businesses in 2026",
    description:
      "Everything you need to know about AI agents: what they are, how they work, and how they can automate your business. Including concrete examples and ROI calculations.",
    category: "AI Explained",
    tags: ["AI agents", "automation", "business", "guide"],
    publishedAt: "2026-02-10",
    updatedAt: "2026-02-10",
    author: "NovaClaw AI Team",
    readingTime: "8 min",
    translationSlug: "wat-zijn-ai-agents",
    content: `## What are AI agents exactly?

An AI agent is an autonomous piece of software that performs tasks on your behalf. Unlike a regular chatbot that only provides answers, an AI agent can actually take action: send emails, analyze data, create content, follow up with customers, and automate workflows.

Think of an AI agent as a digital employee that works 24 hours a day, never calls in sick, and continuously improves at its tasks.

## How does an AI agent work?

AI agents combine three core components:

**1. Language Model (LLM)** — The "brain" of the agent. This can be OpenAI GPT-4o, Anthropic Claude, Google Gemini, or Meta Llama. The model understands instructions and generates intelligent output.

**2. Tools and integrations** — The "hands" of the agent. Through API connections, the agent can execute actions: send emails via your mail system, post on social media, store data in your CRM.

**3. Memory and context** — The "memory" of the agent. The agent remembers previous conversations, customer preferences, and project details. This makes output increasingly relevant.

## 6 types of AI agents for businesses

### Customer Service Agent
Automatically responds to customer messages via email, chat, or Slack. Triages by urgency and escalates complex questions to a human. Average result: 90% faster response time.

### Content Agent
Takes one piece of content (blog post, podcast, video) and creates 10+ variations for different platforms. LinkedIn posts, tweets, newsletters — all in your brand voice.

### SEO & AIO Agent
Creates content that ranks on Google and AI search engines like ChatGPT, Gemini, and Perplexity. Performs keyword research, analyzes competition, and identifies content gaps.

### Email Marketing Agent
Writes complete email sequences: welcome flows, abandoned cart series, newsletters. With A/B testing on subject lines. Result: up to 53% higher conversion.

### Social Media Agent
Manages your social media: creating posts, responding to comments, analyzing engagement. Detects viral trends and adjusts strategy. Average 34% more engagement.

### Automation Agent
Connects all your systems: CRM, accounting, project management, e-commerce. Automates repetitive workflows. Saves an average of 12+ hours per week.

## What does an AI agent cost?

Costs vary depending on complexity:

- **Starter**: from €497/month for 1 custom AI agent
- **Growth**: €997/month for 3 agents with unlimited actions
- **Enterprise**: custom pricing for large organizations

ROI is typically positive quickly. A business saving 12 hours per week at an hourly rate of €75 earns back the investment within the first week.

## AI agents vs. ChatGPT: what's the difference?

ChatGPT is a generic AI tool that you have to manually operate. You type a prompt, get an answer, and have to take action yourself.

An AI agent on the other hand:
- Works autonomously without you having to do anything
- Is trained on your specific business, brand, and audience
- Can actually execute actions (send emails, publish posts)
- Is continuously optimized by experts
- Uses the best AI model per task (not tied to a single provider)

## How do you get started with AI agents?

The easiest way is to work with a specialized agency. NovaClaw builds, tests, and manages custom AI agents for businesses. The process:

1. **Free consultation** — We discuss your goals and challenges
2. **We build** — Our team develops your custom agents within 1-2 weeks
3. **Launch and manage** — The agents go live and we continuously optimize

You don't need any technical knowledge. We do all the work.

## Conclusion

AI agents are the next step in business automation. They go beyond chatbots by actually executing tasks. Whether you want to speed up customer service, scale content, or automate workflows — there's an AI agent for that.

Businesses that start with AI agents now are building a lead that's hard to catch up to. The question isn't whether you'll use AI agents, but when.`,
  },

  // ============================================================
  // ARTICLE 2: AIO vs SEO (NL)
  // ============================================================
  {
    slug: "aio-vs-seo-verschil",
    lang: "nl",
    title: "AIO vs SEO: Waarom Gevonden Worden Door AI Net Zo Belangrijk Is Als Google",
    description:
      "Wat is AIO (AI Optimization)? Hoe verschilt het van SEO? En waarom moet jouw bedrijf in 2026 vindbaar zijn voor zowel Google als AI-zoekmachines zoals ChatGPT en Perplexity.",
    category: "AIO & SEO",
    tags: ["AIO", "SEO", "AI zoekmachines", "vindbaarheid", "GEO"],
    publishedAt: "2026-02-09",
    updatedAt: "2026-02-09",
    author: "NovaClaw AI Team",
    readingTime: "6 min",
    translationSlug: "aio-vs-seo-difference",
    content: `## De verschuiving: van Google naar AI

In 2024 zochten de meeste mensen nog via Google. In 2026 is het landschap fundamenteel veranderd. Miljoenen mensen stellen hun vragen nu direct aan ChatGPT, Google Gemini, Perplexity of Microsoft Copilot.

Dit betekent dat jouw website niet alleen vindbaar moet zijn via traditionele zoekmachines, maar ook geciteerd moet worden door AI-assistenten. Welkom bij AIO: AI Optimization.

## Wat is AIO (AI Optimization)?

AIO — ook wel GEO (Generative Engine Optimization) genoemd — is het optimaliseren van je online aanwezigheid zodat AI-systemen jouw bedrijf herkennen, begrijpen en aanbevelen.

Als iemand aan ChatGPT vraagt: "Welk bureau in Nederland maakt custom AI agents?", dan wil je dat jouw bedrijf in het antwoord staat.

## Hoe verschilt AIO van SEO?

**SEO** richt zich op Google's algoritme: keywords, backlinks, technische optimalisatie, laadsnelheid.

**AIO** richt zich op hoe AI-modellen informatie begrijpen en citeren:
- **Gestructureerde data** (JSON-LD schemas) zodat AI je content begrijpt
- **Duidelijke, feitelijke content** die AI kan citeren als bron
- **FAQ-secties** die direct antwoord geven op vragen
- **Autoriteit en consistentie** over meerdere platforms

## 5 concrete stappen voor AIO

### 1. JSON-LD Schema toevoegen
Voeg Organization, Service, FAQ en Article schemas toe aan je website. Dit helpt AI-systemen je bedrijfsgegevens te begrijpen.

### 2. FAQ-content die directe antwoorden geeft
AI-zoekmachines houden van content die direct en duidelijk antwoord geeft op vragen. Schrijf FAQ-secties die beginnen met de vraag en een helder antwoord geven.

### 3. Publiceer regelmatig kennis-content
Blog artikelen, kennisbank-pagina's en how-to guides. Hoe meer relevante content je publiceert, hoe groter de kans dat AI je als bron gebruikt.

### 4. Wees consistent over alle platforms
Zorg dat je bedrijfsinformatie (naam, diensten, beschrijving) consistent is op je website, LinkedIn, Google Business en andere platforms.

### 5. Schrijf voor mensen en AI tegelijk
Content die goed leesbaar is voor mensen werkt ook goed voor AI. Gebruik duidelijke koppen, korte alinea's en concrete feiten.

## Waarom je nu moet beginnen

AI-zoekmachines worden elke maand populairder. Bedrijven die nu hun AIO-strategie opzetten, worden straks als eerste geciteerd wanneer potentiele klanten vragen stellen aan AI.

De combinatie van SEO en AIO is de winnende strategie voor 2026 en daarna. Niet het een of het ander, maar beide.

## Hoe NovaClaw helpt met AIO

Onze SEO & AIO Agent doet het zware werk: keyword research, content optimalisatie, gestructureerde data en continue monitoring. Alles geautomatiseerd, zodat jij altijd vindbaar bent — door mensen en AI.`,
  },

  // ============================================================
  // ARTICLE 2: AIO vs SEO (EN)
  // ============================================================
  {
    slug: "aio-vs-seo-difference",
    lang: "en",
    title: "AIO vs SEO: Why Being Found by AI Is Just as Important as Google",
    description:
      "What is AIO (AI Optimization)? How does it differ from SEO? And why your business needs to be discoverable by both Google and AI search engines like ChatGPT and Perplexity in 2026.",
    category: "AIO & SEO",
    tags: ["AIO", "SEO", "AI search engines", "discoverability", "GEO"],
    publishedAt: "2026-02-09",
    updatedAt: "2026-02-09",
    author: "NovaClaw AI Team",
    readingTime: "6 min",
    translationSlug: "aio-vs-seo-verschil",
    content: `## The shift: from Google to AI

In 2024, most people still searched via Google. In 2026, the landscape has fundamentally changed. Millions of people now ask their questions directly to ChatGPT, Google Gemini, Perplexity, or Microsoft Copilot.

This means your website needs to not only be findable via traditional search engines, but also cited by AI assistants. Welcome to AIO: AI Optimization.

## What is AIO (AI Optimization)?

AIO — also called GEO (Generative Engine Optimization) — is optimizing your online presence so that AI systems recognize, understand, and recommend your business.

When someone asks ChatGPT: "Which agency in the Netherlands builds custom AI agents?", you want your business to appear in the answer.

## How does AIO differ from SEO?

**SEO** focuses on Google's algorithm: keywords, backlinks, technical optimization, load speed.

**AIO** focuses on how AI models understand and cite information:
- **Structured data** (JSON-LD schemas) so AI understands your content
- **Clear, factual content** that AI can cite as a source
- **FAQ sections** that directly answer questions
- **Authority and consistency** across multiple platforms

## 5 concrete steps for AIO

### 1. Add JSON-LD Schema
Add Organization, Service, FAQ, and Article schemas to your website. This helps AI systems understand your business data.

### 2. FAQ content that gives direct answers
AI search engines love content that directly and clearly answers questions. Write FAQ sections that start with the question and provide a clear answer.

### 3. Publish knowledge content regularly
Blog articles, knowledge base pages, and how-to guides. The more relevant content you publish, the greater the chance AI uses you as a source.

### 4. Be consistent across all platforms
Ensure your business information (name, services, description) is consistent across your website, LinkedIn, Google Business, and other platforms.

### 5. Write for people and AI simultaneously
Content that's easily readable for people also works well for AI. Use clear headings, short paragraphs, and concrete facts.

## Why you should start now

AI search engines are becoming more popular every month. Businesses that set up their AIO strategy now will be cited first when potential customers ask questions to AI.

The combination of SEO and AIO is the winning strategy for 2026 and beyond. Not one or the other, but both.

## How NovaClaw helps with AIO

Our SEO & AIO Agent does the heavy lifting: keyword research, content optimization, structured data, and continuous monitoring. All automated, so you're always discoverable — by people and AI.`,
  },

  // ============================================================
  // ARTICLE 3: 6 AI agents for SMBs (NL)
  // ============================================================
  {
    slug: "6-ai-agents-voor-mkb",
    lang: "nl",
    title: "6 AI Agents Die Elk MKB Bedrijf Nodig Heeft in 2026",
    description:
      "Ontdek welke AI agents het meeste impact hebben voor MKB bedrijven. Van klantenservice tot workflow automation — met concrete ROI-voorbeelden.",
    category: "AI voor MKB",
    tags: ["MKB", "AI agents", "automatisering", "ROI", "klantenservice"],
    publishedAt: "2026-02-08",
    updatedAt: "2026-02-08",
    author: "NovaClaw AI Team",
    readingTime: "7 min",
    translationSlug: "6-ai-agents-every-business-needs",
    content: `## Waarom AI agents onmisbaar worden voor het MKB

De AI-revolutie is niet meer alleen voor grote corporates. In 2026 zijn AI agents toegankelijk, betaalbaar en bewezen effectief voor MKB bedrijven. De bedrijven die nu instappen, bouwen een concurrentievoordeel dat moeilijk in te halen is.

Hier zijn de 6 AI agents die de meeste impact hebben.

## 1. Klantenservice Agent — Bespaar 12+ uur per week

**Het probleem**: Je besteedt uren per dag aan het beantwoorden van klantberichten via email, chat en social media. Dezelfde vragen komen steeds terug.

**De oplossing**: Een AI Klantenservice Agent beantwoordt automatisch veelgestelde vragen, triageert complexe vragen naar de juiste persoon, en volgt op wanneer nodig.

**Resultaat**: Reactietijd daalt met 90%. Van gemiddeld 30 minuten naar 3 minuten. Klanten merken het verschil direct.

**ROI-voorbeeld**: 12 uur bespaard per week x €75/uur = €3.600/maand bespaard. Kosten agent: vanaf €497/maand. Netto winst: €3.100/maand.

## 2. Content Agent — 300% meer content output

**Het probleem**: Je weet dat content marketing belangrijk is, maar je hebt geen tijd om regelmatig te publiceren op alle kanalen.

**De oplossing**: De Content Agent neemt 1 stuk content (bijv. een blogpost of podcast) en maakt er 10+ variaties van: LinkedIn posts, tweets, Instagram captions, nieuwsbrief-content.

**Resultaat**: Van 2 posts per week naar 10+ posts per week, allemaal in jouw tone of voice.

**ROI-voorbeeld**: Een freelance content creator kost €1.500-€3.000/maand. De Content Agent levert vergelijkbare output voor een fractie van de kosten.

## 3. SEO & AIO Agent — Gevonden worden door mens en AI

**Het probleem**: Je website wordt niet gevonden op Google, en al helemaal niet door AI-zoekmachines zoals ChatGPT of Perplexity.

**De oplossing**: De SEO & AIO Agent doet keyword research, analyseert je concurrentie, schrijft geoptimaliseerde content en implementeert technische SEO inclusief gestructureerde data voor AI-vindbaarheid.

**Resultaat**: Hogere rankings bij Google EN citaties door AI-zoekmachines.

## 4. Email Marketing Agent — 53% hogere conversie

**Het probleem**: Je hebt een emaillijst maar stuurt zelden iets. Of je stuurt wel, maar de open rates en conversies zijn teleurstellend.

**De oplossing**: De Email Marketing Agent schrijft complete sequences: welkomstflows, sales funnels, abandoned cart emails, re-engagement campagnes. Met A/B testing op onderwerpregels.

**Resultaat**: Professionele email marketing op automatische piloot met aantoonbaar hogere conversies.

## 5. Social Media Agent — 34% meer engagement

**Het probleem**: Social media kost veel tijd, en je weet niet goed wat werkt.

**De oplossing**: De Social Media Agent maakt posts, reageert op comments, analyseert engagement en detecteert virale trends. Inclusief concurrentie-analyse.

**Resultaat**: Meer en betere content, hogere engagement, meer volgers — zonder dat jij er uren aan besteedt.

## 6. Automation Agent — Koppel al je systemen

**Het probleem**: Je gebruikt 5-10 verschillende tools die niet met elkaar praten. Data moet handmatig overgetypt worden.

**De oplossing**: De Automation Agent koppelt al je systemen: CRM, boekhouding, projectmanagement, e-commerce. Workflows worden geautomatiseerd.

**Resultaat**: 12+ uur per week bespaard op handmatige taken.

## Welke agent is het juiste startpunt?

Dat hangt af van je grootste bottleneck:

- **Veel klantvragen?** → Start met de Klantenservice Agent
- **Te weinig online zichtbaarheid?** → Start met de SEO & AIO Agent
- **Geen tijd voor content?** → Start met de Content Agent
- **Handmatige processen?** → Start met de Automation Agent

Het mooie is: je kunt klein beginnen met 1 agent en later opschalen.

## Hoe NovaClaw het verschil maakt

Wij bouwen, testen en beheren alles voor je. Geen technische kennis nodig, geen lang implementatietraject. Binnen 1-2 weken is je eerste agent live. En met maandelijks opzegbare pakketten zit je nergens aan vast.`,
  },

  // ============================================================
  // ARTICLE 3: 6 AI agents for businesses (EN)
  // ============================================================
  {
    slug: "6-ai-agents-every-business-needs",
    lang: "en",
    title: "6 AI Agents Every Business Needs in 2026",
    description:
      "Discover which AI agents have the most impact for businesses. From customer service to workflow automation — with concrete ROI examples.",
    category: "AI for Business",
    tags: ["SMB", "AI agents", "automation", "ROI", "customer service"],
    publishedAt: "2026-02-08",
    updatedAt: "2026-02-08",
    author: "NovaClaw AI Team",
    readingTime: "7 min",
    translationSlug: "6-ai-agents-voor-mkb",
    content: `## Why AI agents are becoming essential for businesses

The AI revolution is no longer just for large corporates. In 2026, AI agents are accessible, affordable, and proven effective for SMBs. Businesses that get in now are building a competitive advantage that's hard to catch up to.

Here are the 6 AI agents that have the most impact.

## 1. Customer Service Agent — Save 12+ hours per week

**The problem**: You spend hours each day answering customer messages via email, chat, and social media. The same questions keep coming back.

**The solution**: An AI Customer Service Agent automatically answers common questions, triages complex issues to the right person, and follows up when needed.

**Result**: Response time drops by 90%. From an average of 30 minutes to 3 minutes. Customers notice the difference immediately.

**ROI example**: 12 hours saved per week x €75/hour = €3,600/month saved. Agent cost: from €497/month. Net profit: €3,100/month.

## 2. Content Agent — 300% more content output

**The problem**: You know content marketing is important, but you don't have time to publish regularly on all channels.

**The solution**: The Content Agent takes 1 piece of content (e.g., a blog post or podcast) and creates 10+ variations: LinkedIn posts, tweets, Instagram captions, newsletter content.

**Result**: From 2 posts per week to 10+ posts per week, all in your brand voice.

## 3. SEO & AIO Agent — Found by humans and AI

**The problem**: Your website doesn't rank on Google, and certainly isn't cited by AI search engines like ChatGPT or Perplexity.

**The solution**: The SEO & AIO Agent performs keyword research, analyzes your competition, writes optimized content, and implements technical SEO including structured data for AI discoverability.

**Result**: Higher rankings on Google AND citations by AI search engines.

## 4. Email Marketing Agent — 53% higher conversion

**The problem**: You have an email list but rarely send anything. Or you do send, but open rates and conversions are disappointing.

**The solution**: The Email Marketing Agent writes complete sequences: welcome flows, sales funnels, abandoned cart emails, re-engagement campaigns. With A/B testing on subject lines.

**Result**: Professional email marketing on autopilot with demonstrably higher conversions.

## 5. Social Media Agent — 34% more engagement

**The problem**: Social media takes too much time, and you don't know what works.

**The solution**: The Social Media Agent creates posts, responds to comments, analyzes engagement, and detects viral trends. Including competitor analysis.

**Result**: More and better content, higher engagement, more followers — without spending hours on it.

## 6. Automation Agent — Connect all your systems

**The problem**: You use 5-10 different tools that don't talk to each other. Data has to be manually transferred.

**The solution**: The Automation Agent connects all your systems: CRM, accounting, project management, e-commerce. Workflows are automated.

**Result**: 12+ hours per week saved on manual tasks.

## Which agent is the right starting point?

That depends on your biggest bottleneck:

- **Many customer inquiries?** → Start with the Customer Service Agent
- **Too little online visibility?** → Start with the SEO & AIO Agent
- **No time for content?** → Start with the Content Agent
- **Manual processes?** → Start with the Automation Agent

The beauty is: you can start small with 1 agent and scale up later.

## How NovaClaw makes the difference

We build, test, and manage everything for you. No technical knowledge needed, no lengthy implementation process. Your first agent goes live within 1-2 weeks. And with monthly cancelable packages, you're never locked in.`,
  },
];

// ============================================================
// STATIC HELPERS (for the 6 handwritten articles)
// ============================================================

/**
 * Get static posts for a specific language
 */
export function getStaticPostsByLang(lang: "nl" | "en"): BlogPost[] {
  return blogPosts
    .filter((p) => p.lang === lang)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

/**
 * Get a single static post by slug
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

/**
 * Get all static slugs (for build-time generation)
 */
export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}

/**
 * Legacy: Get static posts by lang (still used in some components)
 */
export function getPostsByLang(lang: "nl" | "en"): BlogPost[] {
  return getStaticPostsByLang(lang);
}

// ============================================================
// DYNAMIC: Fetch blog posts from Supabase content_calendar
// ============================================================

interface SupabaseBlogRow {
  id: string;
  content: string;
  status: string;
  performance: Record<string, any>;
  created_at: string;
  media_url: string | null;
}

/**
 * Parse a Supabase content_calendar row into a BlogPost
 */
function parseSupabasePost(row: SupabaseBlogRow): BlogPost | null {
  try {
    const meta = row.performance || {};
    const content = row.content || "";

    // Extract title from first markdown heading
    const titleMatch = content.match(/^#\s+(.+)/m);
    const title = titleMatch ? titleMatch[1].trim() : content.substring(0, 60);

    // Remove the title line from content
    const bodyContent = titleMatch
      ? content.replace(/^#\s+.+\n*/m, "").trim()
      : content;

    const slug = meta.slug || `post-${row.id}`;
    const lang = (meta.lang as "nl" | "en") || "nl";

    return {
      slug,
      lang,
      title,
      description: meta.description || bodyContent.substring(0, 155) + "...",
      content: bodyContent,
      category: meta.category || "AI Trends",
      tags: meta.tags || ["AI"],
      publishedAt: row.created_at,
      updatedAt: row.created_at,
      author: meta.author || "NovaClaw AI Team",
      readingTime: meta.reading_time || "5 min",
      featuredImage: row.media_url || undefined,
      isDynamic: true,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch dynamic blog posts from Supabase
 */
export async function getDynamicPosts(lang?: "nl" | "en"): Promise<BlogPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  try {
    const url = `${supabaseUrl}/rest/v1/content_calendar?platform=eq.blog&status=eq.published&order=created_at.desc&limit=100`;

    const response = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) return [];

    const rows: SupabaseBlogRow[] = await response.json();
    const posts = rows
      .map(parseSupabasePost)
      .filter((p): p is BlogPost => p !== null);

    // Filter by language if specified
    if (lang) {
      return posts.filter((p) => p.lang === lang);
    }

    return posts;
  } catch (error) {
    console.error("Error fetching dynamic blog posts:", error);
    return [];
  }
}

/**
 * Fetch a single dynamic post by slug from Supabase
 */
export async function getDynamicPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getDynamicPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Get ALL posts: static + dynamic, sorted by date (newest first)
 */
export async function getAllPostsCombined(lang?: "nl" | "en"): Promise<BlogPost[]> {
  const staticPosts = lang ? getStaticPostsByLang(lang) : blogPosts;
  const dynamicPosts = await getDynamicPosts(lang);

  // Merge and sort by date
  return [...dynamicPosts, ...staticPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get unique categories across all posts
 */
export function getCategoriesByLang(lang: "nl" | "en"): string[] {
  const posts = getStaticPostsByLang(lang);
  return [...new Set(posts.map((p) => p.category))];
}
