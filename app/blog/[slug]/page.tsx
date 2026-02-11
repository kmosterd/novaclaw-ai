import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { notFound } from "next/navigation";

interface ContentPost {
  id: string;
  content: string;
  platform: string;
  media_url: string | null;
  status: string;
  created_at: string;
}

async function getPost(slug: string): Promise<ContentPost | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("content_calendar")
      .select("id, content, platform, media_url, status, created_at")
      .eq("id", slug)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
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

function getTitle(content: string): string {
  // Use first line or first 60 chars as title
  const firstLine = content.split("\n")[0].replace(/^[#*\s]+/, "").trim();
  if (firstLine.length <= 80) return firstLine;
  return firstLine.substring(0, 77) + "...";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Niet gevonden | NovaClaw AI" };

  const title = getTitle(post.content);
  const description = post.content.substring(0, 155) + "...";

  return {
    title: `${title} | NovaClaw AI Blog`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.created_at,
      authors: ["NovaClaw AI"],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const title = getTitle(post.content);

  // Article JSON-LD for AIO/GEO
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: post.created_at,
    author: {
      "@type": "Organization",
      name: "NovaClaw AI",
      url: "https://novaclaw.tech",
    },
    publisher: {
      "@type": "Organization",
      name: "NovaClaw AI",
      url: "https://novaclaw.tech",
    },
    description: post.content.substring(0, 155),
    mainEntityOfPage: `https://novaclaw.tech/blog/${post.id}`,
  };

  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-neon-cyan transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Terug naar blog
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-1.5 text-xs text-neon-cyan/70">
            <Calendar size={12} />
            {formatDate(post.created_at)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-neon-purple/70">
            <Tag size={12} />
            {getPlatformLabel(post.platform)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-8">
          {title}
        </h1>

        {/* Image */}
        {post.media_url && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.media_url}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <article className="prose prose-invert prose-sm max-w-none">
          {post.content.split("\n").map((paragraph, i) => (
            <p key={i} className="text-white/70 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </article>

        {/* CTA */}
        <div className="mt-12 glass-dark rounded-2xl p-8 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Wil je AI agents voor jouw bedrijf?
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Plan een gratis kennismakingsgesprek en ontdek wat NovaClaw voor jou
            kan betekenen.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-6 py-3 text-sm font-medium rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            Plan Gratis Gesprek &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
