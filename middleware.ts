import { NextRequest, NextResponse } from "next/server";

const LANG_COOKIE = "lang";

// Known English blog slugs (static). Dynamic Supabase posts are handled by BlogLangSync.
const ENGLISH_SLUGS = new Set([
  "what-are-ai-agents",
  "aio-vs-seo-difference",
  "6-ai-agents-every-business-needs",
]);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existingLang = request.cookies.get(LANG_COOKIE)?.value;

  // 1. If cookie already set, respect it
  if (existingLang === "nl" || existingLang === "en") {
    return response;
  }

  // 2. Check if arriving at a known English blog post
  const path = request.nextUrl.pathname;
  if (path.startsWith("/blog/")) {
    const slug = path.replace("/blog/", "").split("?")[0];
    if (ENGLISH_SLUGS.has(slug)) {
      response.cookies.set(LANG_COOKIE, "en", {
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
        sameSite: "lax",
      });
      return response;
    }
  }

  // 3. Check Accept-Language header — only use if explicitly English-first
  const acceptLang = request.headers.get("accept-language") || "";
  const prefersEnglish =
    acceptLang.startsWith("en") && !acceptLang.match(/^(nl|nl-)/);

  const detectedLang = prefersEnglish ? "en" : "nl";

  response.cookies.set(LANG_COOKIE, detectedLang, {
    path: "/",
    maxAge: 365 * 24 * 60 * 60,
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|downloads|robots.txt|sitemap.xml).*)",
  ],
};
