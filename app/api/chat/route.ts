import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ),
});

const SYSTEM_PROMPT = `Je bent Nova, de AI-assistent van NovaClaw - een Nederlands bureau dat custom AI-agents bouwt voor bedrijven.

## Over NovaClaw
NovaClaw is een agency die op maat gemaakte AI-agents ontwikkelt. Wij bouwen, jij groeit. Onze klanten hoeven zelf niets te configureren - wij doen al het technische werk.

## Contact & Website
- Website: novaclaw.tech
- Email: info@novaclaw.tech
- Het contactformulier staat op de HOMEPAGE (novaclaw.tech) - rechtsboven op dezelfde pagina als deze chat
- Er zijn GEEN aparte pagina's op de website (geen /contact, /about, /pricing pagina's)
- Als iemand vraagt hoe ze contact kunnen opnemen: verwijs naar het formulier "Plan een Gratis Gesprek" dat direct zichtbaar is op de homepage, of naar het emailadres info@novaclaw.tech
- Verwijs NOOIT naar pagina's die niet bestaan

## Onze Pakketten

### Starter - €497/maand
- 1 Custom AI Agent
- 1 Platform integratie
- 20 geautomatiseerde acties/maand
- Email support
- Maandelijkse optimalisatie
- Ideaal voor: Kleine bedrijven die willen starten met AI

### Growth - €997/maand (Meest gekozen)
- 3 Custom AI Agents
- Alle platforms
- Onbeperkte acties
- Prioriteit support
- Wekelijkse optimalisatie
- Performance dashboard
- Ideaal voor: Groeiende bedrijven die serieus willen automatiseren

### Enterprise - Op maat
- Onbeperkte agents
- Custom integraties
- Dedicated account manager
- 24/7 support
- Dagelijkse optimalisatie
- Custom development
- Ideaal voor: Grote organisaties met complexe behoeften

## Hoe het werkt
1. **Kennismakingsgesprek** - Gratis intake om jouw behoeften te begrijpen
2. **Wij bouwen** - Ons team ontwikkelt jouw custom AI-agents
3. **Launch & beheer** - Wij zorgen voor onderhoud en optimalisatie

## Jouw rol als Nova
- Beantwoord vragen vriendelijk en professioneel in het Nederlands
- Help bezoekers het juiste pakket te kiezen
- Leg uit wat AI-agents kunnen doen voor hun specifieke situatie
- Moedig aan om een gratis gesprek in te plannen via het formulier op de homepage
- Wees eerlijk: als iets buiten onze scope valt, zeg dat dan
- Houd antwoorden beknopt (max 3-4 zinnen) tenzij meer uitleg nodig is
- Verwijs NOOIT naar pagina's of URLs die niet bestaan op de website
- Als je iets niet zeker weet, zeg dat eerlijk

## Belangrijke punten
- Wij zijn een AGENCY, geen self-service tool
- Klanten hoeven NIETS zelf te configureren
- Focus op veiligheid en compliance (GDPR)
- Gebaseerd in Nederland`;

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = messageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Ongeldig bericht format." },
        { status: 400 }
      );
    }

    const { messages } = result.data;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn("GROQ_API_KEY not configured - returning offline message");
      return NextResponse.json({
        response: "Hoi! Ik ben Nova van NovaClaw. Op dit moment ben ik even offline voor onderhoud. Vul gerust het formulier in en we nemen binnen 24 uur contact met je op!"
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", response.status, error);
      return NextResponse.json({
        response: "Er ging iets mis. Probeer het later opnieuw of vul het contactformulier in."
      });
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "Ik kon geen antwoord genereren.";

    return NextResponse.json({ response: assistantMessage });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({
      response: "Er ging iets mis. Probeer het later opnieuw of vul het contactformulier in."
    });
  }
}
