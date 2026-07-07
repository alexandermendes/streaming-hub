import type { ReactNode } from "react";
import { type Platform, type PlatformId, platformById } from "./data";
import rtWordmark from "@/assets/rt-wordmark.png.asset.json";
import rtRoundel from "@/assets/rt-roundel.svg.asset.json";

export function PhoneFrame({ children, label, id }: { children: ReactNode; label: string; id?: string }) {
  return (
    <div id={id} className="flex flex-col items-center gap-4 scroll-mt-12">
      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
        <span className="h-px w-8 bg-white/15" />
        {label}
        <span className="h-px w-8 bg-white/15" />
      </div>
      <div className="relative w-[390px] h-[844px] rounded-[52px] bg-surface-bg ring-1 ring-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30" />
        <div className="absolute inset-0 overflow-y-auto no-scrollbar">{children}</div>
      </div>
    </div>
  );
}

export function PlatformLogo({ p, size = 56 }: { p: Platform; size?: number }) {
  const isWord = p.short.length > 2;
  const iconUrl = p.iconUrl
    ?? (p.iconSlug ? `https://cdn.simpleicons.org/${p.iconSlug}/${p.iconColor}` : null);
  const isOverride = Boolean(p.iconUrl);
  return (
    <div
      className="rounded-2xl flex items-center justify-center font-display tracking-tight"
      style={{
        width: size,
        height: size,
        background: p.bg,
        color: p.fg,
        boxShadow: p.id === "appletv" ? "inset 0 0 0 1px rgba(255,255,255,0.15)" : undefined,
      }}
    >
      {iconUrl ? (
        <img
          src={iconUrl}
          alt={`${p.name} logo`}
          style={{
            width: size * (isOverride ? 0.92 : 0.55),
            height: size * (isOverride ? 0.92 : 0.55),
            objectFit: "contain",
            filter: isOverride ? "brightness(0) invert(1)" : undefined,
          }}
          loading="lazy"
        />
      ) : (
        <span
          className="font-black"
          style={{
            fontSize: isWord ? size * 0.28 : size * 0.42,
            letterSpacing: isWord ? "-0.04em" : "-0.04em",
            color: p.fg,
          }}
        >
          {p.short}
        </span>
      )}
    </div>
  );
}

export function PlatformTile({ p, selected }: { p: Platform; selected?: boolean }) {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-2">
      <div className={!p.active ? "grayscale opacity-40" : ""}>
        <div className={selected ? "ring-2 ring-brand rounded-2xl ring-offset-2 ring-offset-surface-bg" : ""}>
          <PlatformLogo p={p} size={64} />
        </div>
      </div>
      <span className={`text-[11px] font-medium ${p.active ? "text-white/80" : "text-white/30"}`}>
        {p.name}
      </span>
    </div>
  );
}

export function AddPlatformTile({ href = "#screen-add" }: { href?: string }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", href);
        }
      }}
      className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div
        className="rounded-2xl flex items-center justify-center border border-dashed border-white/20 group-hover:border-brand group-hover:text-brand transition-colors text-white/50"
        style={{ width: 64, height: 64 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <span className="text-[11px] font-medium text-white/60 group-hover:text-brand transition-colors">Add</span>
    </a>
  );
}

export function ScreenHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <RtTopBar />
      <div className="mb-6">
        {eyebrow && <p className="text-white/40 text-[11px] font-medium mb-1">{eyebrow}</p>}
        <h1 className="text-[26px] leading-tight font-bold text-white tracking-tight">{title}</h1>
      </div>
    </>
  );
}

export function RtTopBar() {
  return (
    <div className="flex justify-between items-center mb-6 -mt-2">
      <span className="w-9" />
      <img src={rtWordmark.url} alt="Radio Times" className="h-[25px] w-auto" />
      <div className="size-9 rounded-full bg-surface-muted flex items-center justify-center border border-white/10">
        <span className="text-[10px] font-bold tracking-wider">DH</span>
      </div>
    </div>
  );
}

export function SectionLabel({ children, viewAll, sub }: { children: ReactNode; viewAll?: boolean; sub?: string }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline">
        <h2 className="text-[16px] font-bold text-white tracking-tight">{children}</h2>
        {viewAll && <span className="text-brand text-[12px] font-medium">View all</span>}
      </div>
      {sub && <p className="text-white/40 text-[11px] mt-0.5">{sub}</p>}
    </div>
  );
}

export function Poster({ gradient, title, size = "md", image }: { gradient: string; title: string; size?: "sm" | "md" | "lg"; image?: string }) {
  const dims = size === "sm" ? "aspect-[3/4]" : size === "lg" ? "aspect-video" : "w-24 h-36";
  return (
    <div className={`relative ${dims} rounded-lg overflow-hidden flex-shrink-0`} style={{ background: gradient }}>
      {image && (
        <img src={image} alt={title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {!image && (
        <div className="absolute inset-0 p-2 flex flex-col justify-end">
          <p className="font-display font-black text-white leading-[0.9] text-[13px] drop-shadow-md">{title}</p>
        </div>
      )}
      <div className="absolute top-1.5 left-1.5 text-[7px] font-bold tracking-widest text-white/60 uppercase">RT</div>
    </div>
  );
}

export function BottomTabBar({ active = "streamers" }: { active?: string }) {
  const tabs = ["Home", "Streamers", "Guide", "Saved"];
  return (
    <nav className="absolute bottom-0 inset-x-0 h-20 bg-surface-bg/90 backdrop-blur-xl border-t border-white/5 flex items-end justify-around px-6 pb-6 z-20">
      {tabs.map((t) => {
        const isActive = t.toLowerCase() === active;
        return (
          <div key={t} className={`flex flex-col items-center gap-1 ${isActive ? "text-brand" : "text-white/40"}`}>
            <div className={`size-1.5 rounded-full ${isActive ? "bg-brand" : "bg-transparent"}`} />
            <span className="text-[11px] font-semibold">{t}</span>
          </div>
        );
      })}
    </nav>
  );
}

export function PlatformChip({ id, selected }: { id: PlatformId; selected?: boolean }) {
  const p = platformById(id);
  return (
    <div
      className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full border text-[12px] font-semibold ${
        selected ? "bg-brand text-black border-brand" : "bg-surface-card text-white/70 border-white/10"
      } ${!p.active ? "opacity-40 grayscale" : ""}`}
    >
      <div
        className="size-3 rounded-sm"
        style={{ background: p.bg, boxShadow: p.id === "appletv" ? "inset 0 0 0 1px rgba(255,255,255,0.3)" : undefined }}
      />
      {p.name}
    </div>
  );
}