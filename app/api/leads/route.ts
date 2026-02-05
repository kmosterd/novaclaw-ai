import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase";

// Edge Runtime for maximum performance on Vercel free tier
export const runtime = "edge";

// Input validation schema
const leadSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100),
  company: z.string().max(200).optional().nullable(),
  source: z.string().default("website"),
  metadata: z.record(z.unknown()).optional().default({}),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = leadSchema.parse(body);

    const supabase = getSupabaseAdmin();

    // Check for existing lead with same email
    const { data: existingLead } = await supabase
      .from("leads")
      .select("id")
      .eq("email", validatedData.email)
      .single();

    if (existingLead) {
      // Update existing lead metadata
      const { data, error } = await supabase
        .from("leads")
        .update({
          metadata: {
            ...validatedData.metadata,
            revisit_count: ((existingLead as any).metadata?.revisit_count || 0) + 1,
            last_visit: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingLead.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json(
        { success: true, data, message: "Welcome back!" },
        { status: 200 }
      );
    }

    // Insert new lead
    const { data, error } = await supabase
      .from("leads")
      .insert({
        email: validatedData.email,
        name: validatedData.name,
        company: validatedData.company || null,
        source: validatedData.source,
        status: "new",
        metadata: {
          ...validatedData.metadata,
          signup_timestamp: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) throw error;

    // Trigger personalized outreach agent (via webhook or queue)
    // This is fire-and-forget, don't await
    triggerOutreachAgent(data.id).catch(console.error);

    return NextResponse.json(
      { success: true, data, message: "Lead captured successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Lead capture error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fire-and-forget function to trigger outreach agent
async function triggerOutreachAgent(leadId: string) {
  const supabase = getSupabaseAdmin();

  // Log agent trigger
  await supabase.from("agent_logs").insert({
    agent_type: "distributor",
    action: "trigger_outreach",
    status: "running",
    input: { lead_id: leadId },
    output: {},
    error: null,
    duration_ms: null,
  });

  // In production, this would call a webhook or add to a queue
  // For now, we just log the intent
  console.log(`[Agent] Outreach triggered for lead: ${leadId}`);
}

export async function GET(request: NextRequest) {
  // Verify cron secret for protected endpoint
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.AGENT_CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error("Lead fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
