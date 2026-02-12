import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  company: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const runtime = "edge";

async function sendNotificationEmail(lead: any) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "karsten.mosterd@gmail.com";
  // Use verified domain, fallback to Resend's default for testing
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "NovaClaw <onboarding@resend.dev>";

  if (!RESEND_API_KEY) {
    console.log("No RESEND_API_KEY - skipping email notification");
    return;
  }

  const metadata = lead.metadata || {};

  const emailContent = `
Nieuwe lead via NovaClaw website!

📋 CONTACT GEGEVENS
━━━━━━━━━━━━━━━━━━━
Naam: ${lead.name}
Email: ${lead.email}
Bedrijf: ${lead.company || "Niet opgegeven"}

📊 BUSINESS INFO
━━━━━━━━━━━━━━━━━━━
Type bedrijf: ${metadata.business_type || "Niet opgegeven"}
Doel: ${metadata.business_goal || "Niet opgegeven"}
Budget: ${metadata.budget || "Niet opgegeven"}

⏰ DETAILS
━━━━━━━━━━━━━━━━━━━
Bron: ${lead.source || "website"}
Tijdstip: ${new Date().toLocaleString("nl-NL", { timeZone: "Europe/Amsterdam" })}
GDPR Consent: ${metadata.gdpr_consent ? "✅ Ja" : "❌ Nee"}

---
Bekijk alle leads in je Supabase dashboard.
  `.trim();

  try {
    console.log(`Sending notification email from: ${FROM_EMAIL} to: ${NOTIFICATION_EMAIL}`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFICATION_EMAIL],
        subject: `🚀 Nieuwe Lead: ${lead.name} - ${lead.company || "Particulier"}`,
        text: emailContent,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(`Email send failed (${response.status}):`, responseText);
    } else {
      console.log("Notification email sent successfully:", responseText);
    }
  } catch (error) {
    console.error("Email error:", error);
  }
}

async function saveToSupabase(lead: any) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("Supabase not configured - lead not saved to database");
    return null;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        email: lead.email,
        name: lead.name,
        company: lead.company,
        source: lead.source || "website",
        status: "new",
        metadata: lead.metadata,
      }),
    });

    if (!response.ok) {
      console.error("Supabase error:", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

async function logAgentAction(action: string, input: any, output: any) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) return;

  try {
    await fetch(`${SUPABASE_URL}/rest/v1/agent_logs`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_type: "lead_processor",
        action: action,
        status: "completed",
        input: input,
        output: output,
      }),
    });
  } catch (error) {
    console.error("Log error:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const lead = leadSchema.parse(body);

    // 1. Save to database
    const savedLead = await saveToSupabase(lead);

    // 2. Send email notification
    await sendNotificationEmail(lead);

    // 3. Log the action
    await logAgentAction("new_lead_captured", 
      { email: lead.email, source: lead.source },
      { saved: !!savedLead, notified: true }
    );

    return NextResponse.json({
      success: true,
      message: "Lead captured successfully",
    });
  } catch (error) {
    console.error("Lead API error:", error);
    
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

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedToken = process.env.AGENT_CRON_SECRET;

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?status=eq.new&order=created_at.desc&limit=100`,
      {
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const leads = await response.json();
    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}
