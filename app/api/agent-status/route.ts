import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "edge";

interface ContentItem {
  status: string;
}

interface AgentLog {
  agent_type: string;
  status: string;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    // Get latest agent logs
    const { data: logsData, error: logsError } = await supabase
      .from("agent_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (logsError) throw logsError;
    const logs = logsData as AgentLog[] | null;

    // Get content pipeline stats
    const { data: contentData, error: contentError } = await supabase
      .from("content_calendar")
      .select("status")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (contentError) throw contentError;
    const contentStats = contentData as ContentItem[] | null;

    // Calculate stats
    const stats = {
      published: contentStats?.filter((c) => c.status === "published").length || 0,
      scheduled: contentStats?.filter((c) => c.status === "scheduled").length || 0,
      draft: contentStats?.filter((c) => c.status === "draft").length || 0,
      failed: contentStats?.filter((c) => c.status === "failed").length || 0,
    };

    // Get agent health
    const agentTypes = ["scraper", "generator", "critic", "distributor"];
    const agentHealth = agentTypes.map((type) => {
      const agentLogs = logs?.filter((l) => l.agent_type === type) || [];
      const lastRun = agentLogs[0];
      return {
        type,
        status: lastRun?.status || "idle",
        lastRun: lastRun?.created_at || null,
        successRate: agentLogs.length
          ? (agentLogs.filter((l) => l.status === "success").length / agentLogs.length) * 100
          : 0,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        agents: agentHealth,
        content: stats,
        recentLogs: logs?.slice(0, 5) || [],
      },
    });
  } catch (error) {
    console.error("Agent status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent status" },
      { status: 500 }
    );
  }
}
