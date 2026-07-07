import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  activeDeals,
  offers,
  platformById,
  platforms,
  recommendations,
  upcoming,
  watchlist,
} from "./data";
import {
  BottomTabBar,
  PhoneFrame,
  PlatformLogo,
  PlatformTile,
  AddPlatformTile,
  Poster,
  RtTopBar,
  ScreenHeader,
  SectionLabel,
} from "./parts";
import rtRoundel from "@/assets/rt-roundel.svg.asset.json";

/* ─────────── Screen 1: Hub ─────────── */
export function HubScreen() {
  return (
    <PhoneFrame label="01 · Hub">
      <div className="px-6 pt-14 pb-28">
        <ScreenHeader eyebrow="" title="Dan's Streamers" />

        <div className="mb-8">
          <SectionLabel>Your active platforms</SectionLabel>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {platforms.map((p) => (
              <PlatformTile key={p.id} p={p} />
            ))}
            <AddPlatformTile />
          </div>
        </div>

        <div className="mb-8">
          <SectionLabel sub="3 running this month" viewAll>Active deals</SectionLabel>
          <div className="space-y-3">
            {activeDeals.map((d) => {
              const p = platformById(d.platform);
              const urgent = d.endsInDays <= 7;
              return (
                <div key={d.platform} className="bg-surface-card p-4 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <PlatformLogo p={p} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      <p className="text-[11px] text-white/50">{d.label}</p>
                    </div>
                    <p className="font-bold text-brand text-base">
                      {d.price}
                      <span className="text-[9px] opacity-50 text-white ml-0.5">/mo</span>
                    </p>
                  </div>
                  <div className="h-[4px] w-full bg-white/5 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${d.progress}%`, background: urgent ? "#ff7a3a" : "#b8ff3d" }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-white/40">
                    <span>{d.started}</span>
                    <span className={urgent ? "text-[#ff7a3a]" : ""}>Ends in {d.endsInDays} days</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 bg-brand rounded-3xl text-black">
          <div className="flex justify-between items-center mb-4">
            <span className="bg-black text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
              Editor's tip
            </span>
            <span className="text-[11px] font-medium opacity-70">12 May</span>
          </div>
          <h3
            className="text-[26px] leading-[1.05] mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 600 }}
          >
            Slow Horses, Season 4
          </h3>
          <p className="text-[13px] font-medium mb-5 opacity-80">
            You cancelled Apple TV+ last month — 3 shows on your watchlist drop this week.
          </p>
          <button className="w-full bg-black text-white py-3 rounded-2xl font-semibold text-[13px]">
            Resubscribe · £8.99
          </button>
        </div>

        <div className="mt-8">
          <SectionLabel sub="Find a better price across every platform" viewAll>
            Deals & special offers
          </SectionLabel>

          {/* Search field */}
          <div className="bg-surface-card border border-white/5 rounded-2xl h-12 px-4 flex items-center gap-3 mb-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/40">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[13px] text-white/40 flex-1">Search Netflix, Disney+, deals…</span>
            <span className="text-[10px] font-semibold text-black bg-brand px-2 py-0.5 rounded-full">
              {offers.length} live
            </span>
          </div>

          {/* Quick filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-3">
            {["All", "Free trial", "Under £5", "Annual saver", "Bundles"].map((c, i) => (
              <button
                key={c}
                className={`flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full border ${
                  i === 0
                    ? "bg-white text-black border-white"
                    : "text-white/70 border-white/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Offer cards */}
          <div className="space-y-3">
            {offers.map((o) => {
              const p = platformById(o.platform);
              const toneCls =
                o.badgeTone === "hot"
                  ? "bg-brand text-black"
                  : o.badgeTone === "ending"
                    ? "bg-[#ff7a3a] text-black"
                    : "bg-white text-black";
              return (
                <button
                  key={o.id}
                  className="w-full text-left bg-surface-card border border-white/5 rounded-2xl p-4 flex items-center gap-3"
                >
                  <PlatformLogo p={p} size={44} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${toneCls}`}>
                        {o.badge}
                      </span>
                      <span className="text-[10px] text-white/40 font-medium">{p.name}</span>
                    </div>
                    <p className="text-[14px] font-bold leading-tight tracking-tight truncate">
                      {o.headline}
                    </p>
                    <p className="text-[11px] text-white/50 truncate">{o.detail}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] text-white/40 mb-1">{o.expires}</span>
                    <span className="text-brand text-[18px] leading-none">›</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ─────────── Screen 2: Add subscription ─────────── */
export function AddSubscriptionScreen() {
  const [selectedId, setSelectedId] = useState("paramount");
  const [open, setOpen] = useState(false);
  const selected = platformById(selectedId as any);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 4, 12));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(2024, 7, 12));
  const [dealType, setDealType] = useState<"trial" | "promo" | "full">("trial");
  const [leadDays, setLeadDays] = useState<3 | 5 | 7>(5);
  return (
    <PhoneFrame label="02 · Add Subscription" id="screen-add">
      <div className="px-6 pt-14 pb-28">
        <div className="flex justify-between items-center mb-8">
          <span className="text-[15px] font-medium text-white/60">Cancel</span>
          <p className="text-[14px] font-semibold text-white">New service</p>
          <span className="text-[15px] font-semibold text-brand">Save</span>
        </div>

        <h1 className="text-[24px] font-bold leading-tight mb-7 tracking-tight">Log a new subscription</h1>

        <div className="space-y-5">
          <div>
            <p className="text-[12px] font-medium text-white/50 px-1 mb-2">Platform</p>
            <button
              onClick={() => setOpen((v) => !v)}
              className="w-full bg-surface-card rounded-2xl border border-white/5 px-4 h-14 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <PlatformLogo p={selected} size={28} />
                <span className="text-sm font-medium">{selected.name}</span>
              </div>
              <span className={`text-white/40 text-xs transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
            </button>
            {open && (
              <div className="mt-2 bg-surface-card rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                {platforms.map((p) => {
                  const active = p.id === selectedId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedId(p.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                        active ? "bg-white/5" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <PlatformLogo p={p} size={28} />
                      <span className="text-sm font-medium flex-1">{p.name}</span>
                      {active && <span className="text-brand text-base leading-none">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DateField label="Start date" value={startDate} onChange={setStartDate} />
            <DateField label="Ends" value={endDate} onChange={setEndDate} />
          </div>

          <div>
            <p className="text-[12px] font-medium text-white/50 px-1 mb-2">Deal type</p>
            <div className="flex bg-surface-card p-1 rounded-2xl border border-white/5">
              <Seg active={dealType === "trial"} onClick={() => setDealType("trial")}>Free trial</Seg>
              <Seg active={dealType === "promo"} onClick={() => setDealType("promo")}>Promo rate</Seg>
              <Seg active={dealType === "full"} onClick={() => setDealType("full")}>Full price</Seg>
            </div>
          </div>

          <Field label="Monthly cost">
            <span className="text-sm font-mono">£0.00</span>
            <span className="text-[11px] text-white/40">after trial £6.99</span>
          </Field>

          <div className="bg-surface-card p-5 rounded-2xl border border-white/5 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-bold">Notify me before deal ends</p>
                <p className="text-[11px] text-white/40 mt-0.5">Avoid surprise charges.</p>
              </div>
              <div className="w-11 h-7 bg-brand rounded-full relative shadow-inner">
                <div className="size-5 bg-black rounded-full absolute right-1 top-1" />
              </div>
            </div>
            <div className="flex bg-surface-bg p-1 rounded-xl">
              <Seg active={leadDays === 3} onClick={() => setLeadDays(3)}>3 days</Seg>
              <Seg active={leadDays === 5} onClick={() => setLeadDays(5)}>5 days</Seg>
              <Seg active={leadDays === 7} onClick={() => setLeadDays(7)}>7 days</Seg>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Field({
  label,
  children,
  compact,
}: {
  label: string;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-white/50 px-1 mb-2">{label}</p>
      <div
        className={`bg-surface-card rounded-2xl border border-white/5 px-4 flex items-center justify-between ${
          compact ? "h-12" : "h-14"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Seg({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-[12px] font-semibold rounded-xl ${
        active ? "bg-brand text-black" : "text-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: Date;
  onChange: (d?: Date) => void;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-white/50 px-1 mb-2">{label}</p>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-full bg-surface-card rounded-2xl border border-white/5 px-4 h-12 flex items-center justify-between text-left">
            <span className="text-sm font-mono">
              {value ? format(value, "dd/MM/yyyy") : "—"}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ─────────── Screen 3: Watchlist ─────────── */
export function WatchlistScreen() {
  const sections = [
    { key: "now", title: "Available now", items: watchlist.filter((w) => w.status === "now") },
    { key: "soon", title: "Coming soon", items: watchlist.filter((w) => w.status === "soon") },
    { key: "elsewhere", title: "Not yet on Netflix", items: watchlist.filter((w) => w.status === "elsewhere") },
  ];

  return (
    <PhoneFrame label="03 · Watchlist by Platform">
      <div className="px-6 pt-14 pb-28">
        <RtTopBar />
        <div className="mb-6">
          <h1 className="text-[22px] font-bold text-center mb-1 tracking-tight">My Watchlist</h1>
          <p className="text-center text-[12px] text-white/40 mb-5">Filtered by platform</p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {platforms.map((p) => (
              <PlatformTile key={p.id} p={p} selected={p.id === "netflix"} />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.key}>
              <SectionLabel sub={`${s.items.length} ${s.items.length === 1 ? "title" : "titles"}`} viewAll>{s.title}</SectionLabel>
              <div className="space-y-5">
                {s.items.map((t) => {
                  const muted = t.status !== "now";
                  return (
                    <div key={t.id} className={`flex gap-4 ${muted ? "opacity-60" : ""}`}>
                      <div className={t.status === "elsewhere" ? "grayscale" : ""}>
                        <Poster gradient={t.gradient} title={t.title} image={t.image} />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              t.status === "now" ? "bg-brand text-black" : "bg-white/10 text-white"
                            }`}
                          >
                            RT {t.rt}
                          </span>
                          <span className="text-white/50 text-[11px] font-medium">{t.genre}</span>
                        </div>
                        <h3 className="text-[17px] font-bold leading-tight mb-1 tracking-tight">{t.title}</h3>
                        <p className="text-[12px] text-white/50 mb-3">{t.statusLabel}</p>
                        {t.status === "now" && (
                          <button className="text-[11px] font-semibold border border-white/20 rounded-full px-4 py-1.5 self-start">
                            Mark as watched
                          </button>
                        )}
                        {t.status === "soon" && (
                          <button className="text-[11px] font-semibold border border-brand/50 text-brand rounded-full px-4 py-1.5 self-start">
                            Remind me
                          </button>
                        )}
                        {t.status === "elsewhere" && (
                          <button className="text-[11px] font-semibold text-white/50 underline underline-offset-4 decoration-white/20 self-start">
                            View on {platformById(t.platform).name}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ─────────── Screen 4: Upcoming feed ─────────── */
export function UpcomingScreen() {
  return (
    <PhoneFrame label="04 · Upcoming · Reasons to Subscribe">
      <div className="px-6 pt-14 pb-28">
        <RtTopBar />
        <div className="mb-6">
          <p className="text-white/40 text-[11px] font-medium mb-1">This month</p>
          <h1 className="text-[26px] font-bold leading-tight tracking-tight">Reasons to subscribe - upcoming highlights&nbsp;</h1>
        </div>

        <div className="space-y-8">
          {upcoming.map((u) => {
            const p = platformById(u.platform);
            return (
              <article key={u.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <PlatformLogo p={p} size={24} />
                    <span className="text-[13px] font-semibold">{p.name}</span>
                  </div>
                  <span
                    className={`text-[11px] font-semibold ${
                      p.active ? "text-brand" : "text-white/40"
                    }`}
                  >
                    {p.active ? "● Active" : "○ Lapsed"}
                  </span>
                </div>

                <div
                  className={`bg-surface-card rounded-3xl overflow-hidden border border-white/5 ${
                    p.active ? "" : "opacity-80"
                  }`}
                >
                  <div className="relative">
                    <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                      {u.items.map((it) => (
                        <div key={it.id} className="flex-shrink-0 w-full snap-start">
                          <div className={`relative w-full aspect-[16/10] ${p.active ? "" : "grayscale"}`} style={{ background: it.hero }}>
                            {it.image && (
                              <img src={it.image} alt={it.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
                            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end gap-2">
                              <h3 className="text-[20px] font-bold leading-tight text-white drop-shadow-md tracking-tight">{it.title}</h3>
                              <span className="text-[11px] font-medium text-white/80 flex-shrink-0">{it.release}</span>
                            </div>
                          </div>
                          <div className="px-4 pt-4">
                            <p className="text-[13px] text-white/60 leading-relaxed min-h-[3.5rem]">{it.synopsis}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1.5 py-3">
                      {u.items.map((it, i) => (
                        <span key={it.id} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-4 bg-white/80" : "w-1.5 bg-white/25"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    {p.active ? (
                      <div className="flex gap-2">
                        <button className="flex-1 py-3 bg-white/10 text-white text-[12px] font-semibold rounded-2xl border border-white/5">
                          Save
                        </button>
                        <button className="flex-1 py-3 bg-brand text-black text-[12px] font-semibold rounded-2xl">
                          Remind me
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-dashed border-white/10">
                          <div className="size-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                          <p className="text-[12px] text-white/60 leading-relaxed">
                            You had {p.name} before — 4 titles on your watchlist live there.
                          </p>
                        </div>
                        <button className="w-full py-3 text-brand text-[12px] font-semibold border border-brand/40 rounded-2xl">
                          Resubscribe · from £6.99
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}

/* ─────────── Screen 5: Post-watch ─────────── */
export function PostWatchScreen() {
  return (
    <PhoneFrame label="05 · Post-Watch Prompt">
      {/* dimmed hub backdrop */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="px-6 pt-14">
          <ScreenHeader eyebrow="Hi, Dan" title="My Streamers" />
          <div className="flex gap-4">
            {platforms.slice(0, 4).map((p) => (
              <PlatformLogo key={p.id} p={p} size={56} />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div className="absolute bottom-0 inset-x-0 z-10 bg-surface-card rounded-t-[36px] p-7 border-t border-white/10 max-h-[88%] overflow-y-auto no-scrollbar">
        <div className="w-10 h-1 bg-white/15 rounded-full mx-auto mb-7" />

        <p className="text-brand text-[12px] font-semibold text-center mb-1">You've finished</p>
        <h2
          className="text-[30px] text-center mb-1 tracking-tight"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 600 }}
        >
          Slow Horses
        </h2>
        <p className="text-center text-[12px] text-white/50 mb-7">Season 3 · 6 episodes</p>

        {/* User rating */}
        <div className="bg-surface-bg p-5 rounded-2xl mb-5 border border-white/5">
          <p className="text-[12px] font-semibold text-white/60 text-center mb-3">
            Rate this season
          </p>
          <div className="flex justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = n <= 4;
              return (
                <button key={n} aria-label={`${n} stars`} className="p-0.5">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#b8ff3d" : "none"} stroke={filled ? "#b8ff3d" : "rgba(255,255,255,0.25)"} strokeWidth="1.5" strokeLinejoin="round">
                    <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
                  </svg>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-white/40">
            <span className="text-brand font-semibold">4 / 5 · Loved it</span>
            <span className="text-white/20">·</span>
            <button className="underline underline-offset-2 decoration-white/20">Add a note</button>
          </div>
        </div>

        <div className="bg-surface-bg p-5 rounded-2xl mb-7 border border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-brand text-black text-[10px] font-bold px-2 py-0.5 rounded">
              RT verdict
            </span>
            <span className="text-[11px] text-white/40 font-medium">Now unlocked · spoiler-safe</span>
          </div>
          <p
            className="text-[17px] leading-snug text-white/90"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 500 }}
          >
            "A masterclass in shabbiness and sharp wit. Oldman continues to redefine the spy genre by doing
            less — and meaning more."
          </p>
          <p className="mt-3 text-[11px] text-white/40 font-medium">David Butcher · Radio Times</p>
        </div>

        <h3 className="text-[16px] font-bold mb-3 tracking-tight">Watch next on Apple TV+</h3>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {recommendations.map((r) => (
            <div key={r.id} className="space-y-2">
              <Poster gradient={r.gradient} title={r.title} size="sm" image={r.image} />
              <p className="text-[11px] font-semibold leading-tight">{r.title}</p>
            </div>
          ))}
        </div>

        <button className="w-full py-3 mb-2 text-[13px] font-semibold text-black bg-brand rounded-2xl">
          See all on Apple TV+
        </button>
        <button className="w-full py-3 text-[13px] font-medium text-white/50">
          Dismiss
        </button>
      </div>
    </PhoneFrame>
  );
}

/* ─────────── Notifications strip ─────────── */
export function NotificationsStrip() {
  const notes = [
    {
      eyebrow: "Deal ending",
      tone: "warning",
      title: "Apple TV+ trial ends in 5 days",
      body: "You'll be charged £8.99/month on 12 June. Tap to manage.",
    },
    {
      eyebrow: "Offer alert",
      tone: "good",
      title: "Paramount+ · 3 months for £1",
      body: "Flash deal. You have 4 shows on your watchlist waiting there.",
    },
    {
      eyebrow: "New season",
      tone: "info",
      title: "The White Lotus · S4 drops on NOW",
      body: "Available in 2 weeks. We'll remind you the day it lands.",
    },
  ];
  return (
    <div className="w-full max-w-[420px] mx-auto space-y-3">
      {notes.map((n) => (
        <div key={n.title} className="bg-white/[0.06] backdrop-blur-xl p-4 rounded-2xl border border-white/10">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-2">
              <img src={rtRoundel.url} alt="Radio Times" className="size-5 rounded-md" />
              <span className="text-[11px] font-semibold text-white/70">
                Radio Times · {n.eyebrow}
              </span>
            </div>
            <span className="text-[11px] text-white/40">now</span>
          </div>
          <p className="text-[14px] font-semibold text-white tracking-tight">{n.title}</p>
          <p className="text-[12px] text-white/60 mt-0.5">{n.body}</p>
        </div>
      ))}
    </div>
  );
}