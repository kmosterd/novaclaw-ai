"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { getClientLang, setClientLang } from "@/lib/i18n";

/**
 * Invisible component that syncs the site language to the blog post language.
 * When a user arrives on an English blog post, this sets the lang cookie to "en"
 * and dispatches a custom event so client components (Navbar, FAQ, Chat) update.
 */
export default function BlogLangSync({ postLang }: { postLang: Lang }) {
  useEffect(() => {
    const currentLang = getClientLang();
    if (currentLang !== postLang) {
      setClientLang(postLang);
      document.documentElement.lang = postLang;
      window.dispatchEvent(
        new CustomEvent("langchange", { detail: postLang })
      );
    }
  }, [postLang]);

  return null;
}
