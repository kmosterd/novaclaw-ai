import { getServerLang } from "@/lib/i18n";
import { techStackT } from "@/lib/translations";

// SimpleIcons CDN — returns white SVG logos for dark backgrounds
function ProviderLogo({ icon, name, color }: { icon: string; name: string; color: string }) {
  const logoUrl = `https://cdn.simpleicons.org/${icon}/ffffff`;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Colored glow behind logo */}
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-md"
        style={{ backgroundColor: color }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${name} logo`}
        width={28}
        height={28}
        className="relative z-10 object-contain"
      />
    </div>
  );
}

function TechCard({
  name,
  subtitle,
  description,
  icon,
  color,
  delay,
}: {
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="glass-dark p-5 group hover:border-white/15 transition-all duration-300 animate-fade-in-up flex flex-col items-center text-center gap-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <ProviderLogo icon={icon} name={name} color={color} />
      <div>
        <div className="text-sm font-bold text-white">{name}</div>
        <div
          className="text-xs font-semibold mt-0.5"
          style={{ color }}
        >
          {subtitle}
        </div>
        <div className="text-xs text-white/30 mt-1">{description}</div>
      </div>
    </div>
  );
}

export default async function TechStack() {
  const lang = await getServerLang();
  const t = techStackT[lang];

  return (
    <section className="relative py-16 px-4 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="text-sm text-white/30 uppercase tracking-widest mb-1">
            {t.label}
          </p>
          <h3 className="text-lg sm:text-xl font-semibold text-white/70">
            {t.heading}
          </h3>
        </div>

        {/* AI Models */}
        <div className="mb-6">
          <p className="text-xs text-white/25 uppercase tracking-widest text-center mb-4">
            {t.aiLabel}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.techs.map((tech, idx) => (
              <TechCard key={idx} {...tech} delay={idx * 80} />
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <p className="text-xs text-white/25 uppercase tracking-widest text-center mb-4">
            {t.infraLabel}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.infra.map((tech, idx) => (
              <TechCard key={idx} {...tech} delay={(idx + 4) * 80} />
            ))}
          </div>
        </div>

        <p
          className="text-center text-xs text-white/25 mt-8 max-w-2xl mx-auto animate-fade-in-up"
          style={{ animationDelay: "640ms" }}
        >
          {t.footer}
        </p>
      </div>
    </section>
  );
}
