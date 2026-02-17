import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Globe, Tag } from "lucide-react";
import { getAllPostsCombined, BlogPost } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog & Kennisbank | NovaClaw AI",
  description:
    "Lees de laatste inzichten over AI agents, AIO, marketing automation en hoe AI jouw bedrijf kan laten groeien. In het Nederlands en Engels.",
  alternates: {
    canonical: "https://novaclaw.tech/blog",
  },
  openGraph: {
    title: "Blog & Kennisbank | NovaClaw AI",
    description:
      "Kennisbank over AI agents, AIO optimalisatie en marketing automation voor bedrijven.",
  },
};

function formatDate(dateStr: string, lang: "nl" | "en") {
  return new Intl.DateTimeFormat(lang === "nl" ? "nl-NL" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
}

function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`block glass-dark rounded-2xl overflow-hidden hover:border-neon-cyan/30 transition-all duration-300 group ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Featured image */}
      <div
        className={`w-full relative overflow-hidden ${
          featured ? "h-48" : "h-36"
        }`}
      >
        {post.featuredImage ? (
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 50vw"}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 via-neon-cyan/10 to-neon-magenta/20 flex items-center justify-center">
            <span className="text-4xl opacity-30">
              {post.category.includes("Uitleg") || post.category.includes("Explained")
                ? "\u{1F916}"
                : post.category.includes("AIO") || post.category.includes("SEO")
                ? "\u{1F50D}"
                : post.category.includes("Trends")
                ? "\u{1F4C8}"
                : "\u26A1"}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
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
          {post.isDynamic && (
            <span className="text-[10px] text-neon-green/60 px-1.5 py-0.5 rounded border border-neon-green/20">
              Nieuw
            </span>
          )}
        </div>

        {/* Category badge */}
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 mb-3">
          {post.category}
        </span>

        {/* Title */}
        <h2
          className={`font-bold text-white group-hover:text-neon-cyan transition-colors mb-2 ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] text-white/30"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        <span className="inline-block mt-4 text-xs text-neon-cyan font-medium group-hover:underline">
          {post.lang === "nl" ? "Lees meer" : "Read more"} &rarr;
        </span>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const nlPosts = await getAllPostsCombined("nl");
  const enPosts = await getAllPostsCombined("en");

  return (
    <main className="relative min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back link */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-neon-cyan transition-colors mb-6"
          >
            <ArrowLeft size={16} /> Terug naar home
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Blog & Kennisbank
          </h1>
          <p className="text-white/50 max-w-2xl leading-relaxed">
            De laatste inzichten over AI agents, AIO optimalisatie en marketing
            automation. Geschreven voor ondernemers die willen groeien met AI.
          </p>
        </div>

        {/* Dutch articles */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">
              Nederlands
            </h2>
            <span className="text-xs text-white/30 px-2 py-0.5 rounded-full border border-white/10">
              {nlPosts.length} artikelen
            </span>
          </div>

          {nlPosts.length === 0 ? (
            <div className="glass-dark rounded-2xl p-12 text-center">
              <p className="text-white/40">
                Nog geen artikelen gepubliceerd. Kom binnenkort terug!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {nlPosts.map((post, idx) => (
                <PostCard key={post.slug} post={post} featured={idx === 0} />
              ))}
            </div>
          )}
        </div>

        {/* English articles */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">
              English
            </h2>
            <span className="text-xs text-white/30 px-2 py-0.5 rounded-full border border-white/10">
              {enPosts.length} articles
            </span>
          </div>

          {enPosts.length === 0 ? (
            <div className="glass-dark rounded-2xl p-12 text-center">
              <p className="text-white/40">
                No articles published yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {enPosts.map((post, idx) => (
                <PostCard key={post.slug} post={post} featured={idx === 0} />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="glass-dark rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Wil je AI agents voor jouw bedrijf?
          </h3>
          <p className="text-sm text-white/50 mb-6 max-w-lg mx-auto">
            Plan een gratis kennismakingsgesprek en ontdek welke AI agents het
            meeste impact hebben voor jouw business.
          </p>
          <Link
            href="/#contact"
            className="inline-block px-8 py-4 text-sm font-medium rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white hover:opacity-90 transition-opacity"
          >
            Plan Gratis Gesprek &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
