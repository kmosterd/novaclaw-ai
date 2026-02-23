import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { syncContactToHubSpot } from "@/lib/hubspot";

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  source: z.enum(["newsletter", "lead_magnet", "inline_cta"]),
  lang: z.enum(["nl", "en"]).optional().default("nl"),
});

export const runtime = "edge";

/**
 * Upsert subscriber to Supabase leads table.
 * Uses email UNIQUE constraint with merge-duplicates for upsert behavior.
 */
async function saveSubscriber(data: {
  email: string;
  name?: string;
  source: string;
  lang: string;
}) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("Supabase not configured — subscriber not saved");
    return null;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify({
        email: data.email,
        name: data.name || null,
        source: "blog_subscriber",
        status: "subscribed",
        metadata: {
          subscribe_source: data.source,
          subscribed_at: new Date().toISOString(),
          lang: data.lang,
          ...(data.source === "lead_magnet" && {
            lead_magnet: "ai-agent-checklist",
          }),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase subscriber error:", errorText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Subscriber save error:", error);
    return null;
  }
}

/**
 * Send lead magnet email with download link via Resend
 */
async function sendLeadMagnetEmail(email: string, lang: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL || "NovaClaw <onboarding@resend.dev>";

  if (!RESEND_API_KEY) {
    console.log("No RESEND_API_KEY — skipping lead magnet email");
    return;
  }

  const downloadUrl = "https://novaclaw.tech/downloads/ai-agent-checklist.pdf";

  const subject =
    lang === "nl"
      ? "Jouw AI Agent Checklist — Gratis Download"
      : "Your AI Agent Checklist — Free Download";

  const body =
    lang === "nl"
      ? `Hi!

Bedankt voor je interesse in AI agents. Hier is jouw gratis AI Agent Checklist:

${downloadUrl}

In deze checklist ontdek je:
- Welke AI agents het meeste impact hebben voor jouw bedrijf
- Hoe je de ROI van AI agents berekent
- De 6 meest gebruikte AI agent types
- Een stap-voor-stap implementatieplan

Wil je ontdekken wat AI agents voor jouw bedrijf kunnen betekenen?
Plan een gratis kennismakingsgesprek: https://novaclaw.tech/#contact

Met vriendelijke groet,
Het NovaClaw AI Team

---
Je ontvangt deze email omdat je de AI Agent Checklist hebt aangevraagd op novaclaw.tech.`
      : `Hi!

Thanks for your interest in AI agents. Here's your free AI Agent Checklist:

${downloadUrl}

In this checklist you'll discover:
- Which AI agents have the most impact for your business
- How to calculate the ROI of AI agents
- The 6 most common AI agent types
- A step-by-step implementation plan

Want to discover what AI agents can do for your business?
Schedule a free consultation: https://novaclaw.tech/#contact

Best regards,
The NovaClaw AI Team

---
You're receiving this email because you requested the AI Agent Checklist on novaclaw.tech.`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [email],
        subject,
        text: body,
      }),
    });

    if (!response.ok) {
      console.error(
        "Lead magnet email error:",
        response.status,
        await response.text()
      );
    } else {
      console.log("Lead magnet email sent to:", email);
    }
  } catch (error) {
    console.error("Lead magnet email error:", error);
  }
}

/**
 * Send notification to site owner about new subscriber
 */
async function sendNotification(email: string, source: string) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL =
    process.env.NOTIFICATION_EMAIL || "karsten.mosterd@gmail.com";
  const FROM_EMAIL =
    process.env.RESEND_FROM_EMAIL || "NovaClaw <onboarding@resend.dev>";

  if (!RESEND_API_KEY) return;

  const sourceLabel =
    source === "lead_magnet"
      ? "AI Agent Checklist download"
      : source === "inline_cta"
        ? "Inline blog CTA"
        : "Newsletter banner";

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFICATION_EMAIL],
        subject: `📬 Nieuwe subscriber: ${email}`,
        text: `Nieuwe blog subscriber!\n\nEmail: ${email}\nBron: ${sourceLabel}\nTijdstip: ${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}`,
      }),
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = subscribeSchema.parse(body);

    // 1. Save/upsert subscriber in Supabase
    await saveSubscriber(data);

    // 2. Send lead magnet email if applicable
    if (data.source === "lead_magnet") {
      await sendLeadMagnetEmail(data.email, data.lang);
    }

    // 3. Notify site owner
    await sendNotification(data.email, data.source);

    // 4. Sync to HubSpot (fire-and-forget)
    syncContactToHubSpot(data.email, {
      firstname: data.name,
      blog_subscriber: "true",
      subscribe_source: data.source,
      ...(data.source === "lead_magnet" && {
        lead_magnet_downloaded: "ai-agent-checklist",
      }),
    }).catch((err) => console.error("[HubSpot] Background sync error:", err));

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully",
      downloadUrl:
        data.source === "lead_magnet"
          ? "/downloads/ai-agent-checklist.pdf"
          : undefined,
    });
  } catch (error) {
    console.error("Subscribe API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
