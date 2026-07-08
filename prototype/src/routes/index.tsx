import { createFileRoute } from "@tanstack/react-router";
import {
  AddSubscriptionScreen,
  HubScreen,
  NotificationsStrip,
  PostWatchScreen,
  UpcomingScreen,
  WatchlistScreen,
} from "@/components/streamers/screens";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Streamers — Radio Times" },
      {
        name: "description",
        content:
          "A calm dashboard for every streaming subscription you juggle, alongside your Radio Times watchlist — deals, expiries and what to watch next.",
      },
      { property: "og:title", content: "My Streamers — Radio Times" },
      {
        property: "og:description",
        content: "Manage every streaming subscription alongside your Radio Times watchlist.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-surface-bg text-white font-sans">
      {/* Masthead */}
      <header className="px-6 pt-16 pb-12 max-w-[720px] mx-auto text-center">
        <p className="text-brand text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
          Radio Times · Mobile App
        </p>
        <h1 className="font-display font-black text-5xl sm:text-6xl leading-[0.95] tracking-tight mb-5">
          Binge Buddy.
        </h1>
        <p className="text-sm sm:text-base text-white/60 max-w-md mx-auto leading-relaxed">
          One home for every subscription you juggle — deals tracked, expiries
          flagged, your watchlist sorted by what's actually streaming where.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          <span className="h-px w-12 bg-white/15" />
          5 Screens · iOS · Dark
          <span className="h-px w-12 bg-white/15" />
        </div>
      </header>

      {/* Phone stack */}
      <section className="flex flex-col items-center gap-20 px-4 pb-24">
        <HubScreen />
        <AddSubscriptionScreen />
        <WatchlistScreen />
        <UpcomingScreen />
        <PostWatchScreen />

        {/* Notifications */}
        <div className="w-full max-w-[720px] mt-4">
          <div className="text-center mb-8">
            <p className="text-brand text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
              Push & lock-screen
            </p>
            <h2 className="font-display font-black text-3xl">Alerts.</h2>
          </div>
          <NotificationsStrip />
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
        Radio Times · My Streamers · Concept design
      </footer>
    </main>
  );
}
