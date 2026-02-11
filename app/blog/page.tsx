import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | NovaClaw AI - Kennisbank over AI Agents",
  description:
    "Lees de laatste inzichten over AI agents, marketing automation en hoe AI jouw bedrijf kan laten groeien. Geschreven door het NovaClaw team.",
  openGraph: {
    title: "Blog | NovaClaw AI",
    description: "Kennisbank over AI agents en marketing automation",
  },
};

export const revalidate = 3600; // Revalidate every hour

interface ContentPost {
  id: string;
  content: string;
  platform: string;
  media_url: string | null;
  status: string;
  created_at: string;
}

async function getPosts(): Promise<ContentPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("content_calendar")
      .select("id, content, platform, media_url, status, created_at")
      .in("status", ["published", "scheduled", "draft"])
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Blog: Error fetching posts", error);
      return [];
    }

    return data || [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

function getExcerpt(content: string, maxLength = 160): string {
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
}

function getPlatformLabel(platform: string): string {
  const labels: Record<string, string> = {
    linkedin: "LinkedIn",
    twitter: "Twitter/X",
    instagram: "Instagram",
    blog: "Blog",
  };
  return labels[platform] || platform;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main className="relative min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-neon-cyan transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Terug naar home
          </Link>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Blog & Kennisbank
          </h1>
          <p className="text-white/50 max-w-2xl leading-relaxed">
            De laatste inzichten over AI agents, marketing automation en hoe
            kunstmatige intelligentie jouw bedrijf kan transformeren.
          </p>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="glass-dark rounded-2xl p-12 text-center">
            <p className="text-white/40">
              Nog geen artikelen gepubliceerd. Kom binnenkort terug!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block glass-dark rounded-2xl p-6 hover:border-neon-cyan/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-neon-cyan/70">
                    <Calendar size={12} />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-neon-purple/70">
                    <Tag size={12} />
                    {getPlatformLabel(post.platform)}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                  {getExcerpt(post.content, 250)}
                </p>
                <span className="inline-block mt-3 text-xs text-neon-cyan group-hover:underline">
                  Lees meer &rarr;
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
