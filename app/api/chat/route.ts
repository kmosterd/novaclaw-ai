import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Edge Runtime for low latency
export const runtime = "edge";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
});

const SYSTEM_PROMPT = `You are NovaClaw AI, an autonomous marketing intelligence assistant. You help users understand and leverage AI-powered marketing automation.

Key capabilities you can explain:
1. **Autonomous Content Loop**: AI agents that research trends, generate multi-modal content, and distribute across platforms 24/7
2. **Lead Intelligence**: Automatic lead capture, scoring, and personalized outreach sequences
3. **Multi-Platform Distribution**: Automated posting to LinkedIn, Instagram, Twitter, and blogs
4. **Quality Control**: Critic-agent system that reviews content for quality and compliance before publication
5. **Analytics & Optimization**: Real-time performance tracking and autonomous optimization

Keep responses concise, helpful, and focused on the user's question. Use a professional but friendly tone. If asked about pricing or specific features not mentioned, suggest they sign up for early access to learn more.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = chatRequestSchema.parse(body);

    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (!anthropicKey) {
      // Fallback response if API key not configured
      return NextResponse.json({
        message: "I'm currently in demo mode. Sign up for early access to interact with the full NovaClaw AI system!",
      });
    }

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Using Haiku for cost efficiency
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Anthropic API error:", errorData);
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const assistantMessage = data.content[0]?.text || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({
      message: assistantMessage,
      usage: data.usage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Chat error:", error);
    return NextResponse.json(
      { message: "I'm having trouble connecting right now. Please try again in a moment." },
      { status: 200 } // Return 200 to show graceful degradation message
    );
  }
}
