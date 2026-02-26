export type Lang = "nl" | "en";
export const DEFAULT_LANG: Lang = "nl";
export const SUPPORTED_LANGS: Lang[] = ["nl", "en"];
export const LANG_COOKIE = "lang";

/**
 * Read language from cookies in a server component.
 */
export async function getServerLang(): Promise<Lang> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANG_COOKIE)?.value;
  if (langCookie === "en") return "en";
  return DEFAULT_LANG;
}

/**
 * Read language from document cookie in client-side code.
 */
export function getClientLang(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const match = document.cookie.match(/(?:^|;\s*)lang=(\w+)/);
  if (match && match[1] === "en") return "en";
  return DEFAULT_LANG;
}

/**
 * Set language cookie from client-side code.
 */
export function setClientLang(lang: Lang): void {
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
}
