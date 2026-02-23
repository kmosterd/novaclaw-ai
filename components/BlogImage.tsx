"use client";

import Image from "next/image";
import { useState } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  category?: string;
}

export default function BlogImage({
  src,
  alt,
  fill,
  priority,
  className,
  sizes,
  category = "",
}: BlogImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    const emoji = category.includes("Uitleg") || category.includes("Explained")
      ? "\u{1F916}"
      : category.includes("AIO") || category.includes("SEO")
      ? "\u{1F50D}"
      : category.includes("Trends")
      ? "\u{1F4C8}"
      : "\u26A1";

    return (
      <div className="w-full h-full bg-gradient-to-br from-neon-purple/20 via-neon-cyan/10 to-neon-magenta/20 flex items-center justify-center">
        <span className="text-6xl opacity-30">{emoji}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
}
