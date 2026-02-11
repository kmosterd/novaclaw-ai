import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Globe, Tag, Languages } from "lucide-react";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllSlugs, BlogPost } from "@/lib/blog-data";

function formatDate(dateStr: string, lang: "nl" | "en") {
  return new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

/**
 * Static params for all blog posts — enables static generation
 */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Niet gevonden | NovaClaw AI" };
  }

  return {
    title: `${post.title} | NovaClaw AI Blog`,
    description: post.description,
    alternates: {
      canonical: `https://novaclaw.tech/blog/${post.slug}`,
      ...(post.translationSlug && {
        languages: {
          [post.lang === "nl" ? "en" : "nl-NL"]: `https://novaclaw.tech/blog/${post.translationSlug}`,
        },
      }),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      locale: post.lang === "nl" ? "nl_NL" : "en_US",
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

/**
 * Simple markdown-to-JSX renderer for blog content.
 * Handles: ##, ###, **bold**, - lists, paragraphs
 */
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 mb-6 text-white/70">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function renderInline(text: string): React.ReactNode {
    // Handle **bold** text
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      continue;
    }

    // H2
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-xl sm:text-2xl font-bold text-white mt-10 mb-4">
          {trimmed.slice(3)}
        </h2>
      );
      continue;
    }

    // H3
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-lg font-semibold text-neon-cyan mt-8 mb-3">
          {trimmed.slice(4)}
        </h3>
      );
      continue;
    }

    // List item
    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={key++} className="text-sm sm:text-base text-white/70 leading-relaxed mb-4">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();
  return elements;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Get translation if available
  const translation = post.translationSlug
    ? getPostBySlug(post.translationSlug)
    : undefined;

  // Article JSON-LD for AIO/GEO
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
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
    mainEntityOfPage: `https://novaclaw.tech/blog/${post.slug}`,
    inLanguage: post.lang === "nl" ? "nl-NL" : "en-US",
    keywords: post.tags.join(", "),
    articleSection: post.category,
    ...(post.translationSlug && {
      translationOfWork: {
        "@type": "Article",
        url: `https://novaclaw.tech/blog/${post.translationSlug}`,
      },
    }),
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
          <ArrowLeft size={16} />
          {post.lang === "nl" ? "Terug naar blog" : "Back to blog"}
        </Link>

        {/* Translation banner */}
        {translation && (
          <div className="mb-6 glass-dark rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/50">
              <Languages size={16} className="text-neon-cyan" />
              {post.lang === "nl"
                ? "Dit artikel is ook beschikbaar in het Engels"
                : "This article is also available in Dutch"}
            </div>
            <Link
              href={`/blog/${translation.slug}`}
              className="text-xs font-medium text-neon-cyan hover:underline"
            >
              {post.lang === "nl" ? "Read in English →" : "Lees in het Nederlands →"}
            </Link>
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="flex items-center gap-1.5 text-xs text-neon-cyan/70">
            <Calendar size={12} />
            {formatDate(post.publishedAt, post.lang)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-neon-purple/70">
            <Clock size={12} />
            {post.readingTime}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-white/40">
            <Globe size={12} />
            {post.lang === "nl" ? "Nederlands" : "English"}
          </span>
        </div>

        {/* Category badge */}
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Description */}
        <p className="text-base text-white/50 mb-8 leading-relaxed">
          {post.description}
        </p>

        {/* Gradient header as image placeholder */}
        <div className="w-full h-48 sm:h-64 rounded-2xl bg-gradient-to-br from-neon-purple/20 via-neon-cyan/10 to-neon-magenta/20 flex items-center justify-center mb-10">
          <span className="text-6xl opacity-30">
            {post.category.includes("Uitleg") || post.category.includes("Explained")
              ? "🤖"
              : post.category.includes("AIO") || post.category.includes("SEO")
              ? "🔍"
              : "⚡"}
          </span>
        </div>

        {/* Article content */}
        <article className="mb-12">
          {renderMarkdown(post.content)}
        </article>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12 pt-6 border-t border-white/10">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-white/40 border border-white/10"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        {/* Author */}
        <div className="glass-dark rounded-xl p-5 mb-12 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-white font-bold text-lg">
            N
          </div>
          <div>
            <p className="text-sm font-medium text-white">{post.author}</p>
            <p className="text-xs text-white/40">
              {post.lang === "nl"
                ? "Het NovaClaw team schrijft over AI agents, AIO en marketing automation."
                : "The NovaClaw team writes about AI agents, AIO and marketing automation."}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-dark rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            {post.lang === "nl"
              ? "Wil je AI agents voor jouw bedrijf?"
              : "Want AI agents for your business?"}
          </h3>
          <p className="text-sm text-white/50 mb-6 max-w-lg mx-auto">
            {post.lang === "nl"
              ? "Plan een gratis kennismakingsgesprek en ontdek wat NovaClaw voor jou kan betekenen."
              : "Schedule a free consultation and discover what NovaClaw can do for you."}
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            {post.lang === "nl" ? "Plan Gratis Gesprek" : "Schedule Free Consultation"} &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
