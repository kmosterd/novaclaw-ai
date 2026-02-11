"use client";

/**
 * Lightweight CSS-based particle field — replaces Three.js (~900KB saved)
 * Uses CSS animations + random dots for a similar visual effect
 */
export default function ParticleField() {
  return (
    <div className="fixed inset-0 -z-5 opacity-40 pointer-events-none overflow-hidden">
      {/* Animated rings (replaces OctahedronCore + InnerRings) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
        <div className="absolute inset-0 rounded-full border border-neon-cyan/20 animate-spin-slow" />
        <div className="absolute inset-4 rounded-full border border-neon-purple/15 animate-spin-reverse" />
        <div className="absolute inset-12 bg-neon-cyan/5 rounded-full blur-xl" />
      </div>

      {/* Static particle dots via CSS */}
      <div className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${(i * 2.5 + (i * 17) % 100) % 100}%`,
              top: `${(i * 3.1 + (i * 23) % 100) % 100}%`,
              backgroundColor: i % 3 === 0 ? '#00f5ff' : i % 3 === 1 ? '#8b5cf6' : '#ff00ff',
              opacity: 0.2 + (i % 5) * 0.1,
              animationDelay: `${(i * 0.7) % 5}s`,
              animationDuration: `${3 + (i % 4)}s`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
