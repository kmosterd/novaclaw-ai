import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://novaclaw.tech";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Dynamic blog posts from Supabase
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data: posts } = await supabase
        .from("content_calendar")
        .select("id, created_at, platform")
        .eq("platform", "blog")
        .order("created_at", { ascending: false })
        .limit(100);

      if (posts) {
        blogPages = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.id}`,
          lastModified: new Date(post.created_at),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));
      }
    }
  } catch (error) {
    console.error("Sitemap: Error fetching blog posts", error);
  }

  return [...staticPages, ...blogPages];
}
