import { MetadataRoute } from "next";
import { blogPosts, getDynamicPosts } from "@/lib/blog-data";

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
    {
      url: `${baseUrl}/tools/roi-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Static blog posts with translation alternates
  const staticBlogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    ...(post.translationSlug && {
      alternates: {
        languages: {
          [post.lang === "nl" ? "en" : "nl-NL"]: `${baseUrl}/blog/${post.translationSlug}`,
        },
      },
    }),
  }));

  // Dynamic blog posts from Supabase
  let dynamicBlogPages: MetadataRoute.Sitemap = [];
  try {
    const dynamicPosts = await getDynamicPosts();
    dynamicBlogPages = dynamicPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap: Error fetching dynamic posts:", error);
  }

  return [...staticPages, ...dynamicBlogPages, ...staticBlogPages];
}
