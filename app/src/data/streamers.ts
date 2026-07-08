/**
 * Data ported from the web concept (src/components/streamers/data.ts).
 * Only the slices used by screens 1 (Hub) and 2 (Add Subscription) are kept:
 * platforms, active deals and offers.
 *
 * Note: the web build renders brand logos from remote SVGs (simpleicons /
 * wikipedia). React Native's Image can't render remote SVGs, so the mobile
 * app uses the design's own fallback — a coloured tile with the short label
 * (`short`) drawn in the brand foreground colour (`fg`).
 */
export type PlatformId =
  | "netflix"
  | "appletv"
  | "disney"
  | "paramount"
  | "itvx"
  | "now"
  | "prime";

export type Platform = {
  id: PlatformId;
  name: string;
  short: string;
  bg: string;
  fg: string;
  active: boolean;
  pricePerMonth: number; // base monthly price in £
  cancelUrl: string; // provider's manage/cancel page (opened by "Cancel this subscription")
};

export const platforms: Platform[] = [
  { id: "netflix",   name: "Netflix",      short: "N",      bg: "#000000", fg: "#E50914", active: true,  pricePerMonth: 17.99, cancelUrl: "https://www.netflix.com/cancelplan" },
  { id: "disney",    name: "Disney+",      short: "Disney+",bg: "#0E2A6B", fg: "#ffffff", active: true,  pricePerMonth: 4.99,  cancelUrl: "https://www.disneyplus.com/account/subscription" },
  { id: "appletv",   name: "Apple TV+",    short: "tv+",    bg: "#000000", fg: "#ffffff", active: true,  pricePerMonth: 8.99,  cancelUrl: "https://apps.apple.com/account/subscriptions" },
  { id: "itvx",      name: "ITVX",         short: "ITVX",   bg: "#101820", fg: "#ffd400", active: true,  pricePerMonth: 5.99,  cancelUrl: "https://www.itv.com/account" },
  { id: "paramount", name: "Paramount+",   short: "P+",     bg: "#0064FF", fg: "#ffffff", active: false, pricePerMonth: 6.99,  cancelUrl: "https://www.paramountplus.com/account/" },
  { id: "now",       name: "NOW",          short: "NOW",    bg: "#001E3C", fg: "#00d1a6", active: false, pricePerMonth: 9.99,  cancelUrl: "https://www.nowtv.com/account" },
  { id: "prime",     name: "Prime Video",  short: "prime",  bg: "#00A8E1", fg: "#ffffff", active: false, pricePerMonth: 8.99,  cancelUrl: "https://www.amazon.co.uk/gp/video/settings" },
];

export const platformById = (id: PlatformId) => platforms.find((p) => p.id === id)!;

export type Deal = {
  platform: PlatformId;
  label: string;
  price: string;
  priceNum: number; // numeric £ value for calculations
  progress: number; // 0..100
  started: string;
  endsInDays: number;
};

export const activeDeals: Deal[] = [
  { platform: "netflix",  label: "Standard with Ads", price: "£4.99", priceNum: 4.99, progress: 40, started: "Started 01 Jun", endsInDays: 30 },
  { platform: "disney",  label: "Annual promo rate", price: "£1.99", priceNum: 1.99, progress: 65, started: "Started 12 Jan", endsInDays: 42 },
  { platform: "appletv", label: "Free trial",        price: "£0.00", priceNum: 0.00, progress: 80, started: "Started 25 Apr", endsInDays: 5  },
  { platform: "itvx",    label: "Premium • Monthly", price: "£5.99", priceNum: 5.99, progress: 25, started: "Started 02 May", endsInDays: 22 },
];

/** Total spend the previous calendar month — used for the month-on-month delta. */
export const lastMonthTotal = 1.98;

export type Offer = {
  id: string;
  platform: PlatformId;
  headline: string;
  detail: string;
  badge: string;
  badgeTone: "hot" | "new" | "ending";
  expires: string;
};

export const offers: Offer[] = [
  { id: "para-1",    platform: "paramount", headline: "3 months for £1",              detail: "Then £6.99/mo. New & returning members.",              badge: "Hot deal",      badgeTone: "hot",    expires: "Ends Sun" },
  { id: "disney-1",  platform: "disney",    headline: "Annual plan · save 16%",        detail: "£79.90 for 12 months on Standard with Ads.",           badge: "Editor's pick", badgeTone: "new",    expires: "Limited time" },
  { id: "now-1",     platform: "now",       headline: "Entertainment £6.99/mo",        detail: "Was £9.99. First 3 months for new members.",           badge: "Ending soon",   badgeTone: "ending", expires: "3 days left" },
  { id: "prime-1",   platform: "prime",     headline: "30-day free trial",             detail: "Then £8.99/mo. Includes Prime delivery.",              badge: "Free trial",    badgeTone: "new",    expires: "Always on" },
  { id: "netflix-1", platform: "netflix",   headline: "Standard with Ads · £4.99/mo", detail: "Reduced from £6.99. Existing and new members.",        badge: "Hot deal",      badgeTone: "hot",    expires: "Ends 31 Jul" },
  { id: "itvx-1",    platform: "itvx",      headline: "ITVX Premium · 2 months free", detail: "Then £3.99/mo. Cancel anytime.",                       badge: "Free trial",    badgeTone: "new",    expires: "Limited time" },
  { id: "appletv-1", platform: "appletv",   headline: "Apple TV+ free for 3 months",  detail: "With any Apple device purchase. New subscribers only.", badge: "New offer",     badgeTone: "new",    expires: "Ongoing" },
  { id: "now-2",     platform: "now",       headline: "Cinema + Entertainment bundle", detail: "£11.99/mo. Save £4 vs buying separately.",            badge: "Hot deal",      badgeTone: "hot",    expires: "Ends Fri" },
  { id: "para-2",    platform: "paramount", headline: "Student discount · 25% off",   detail: "£5.24/mo with valid student email.",                   badge: "Editor's pick", badgeTone: "new",    expires: "Always on" },
  { id: "prime-2",   platform: "prime",     headline: "Prime Student · 6 months free",detail: "Then £4.49/mo. Includes Prime delivery & music.",      badge: "Hot deal",      badgeTone: "hot",    expires: "Always on" },
];

/* ── Screen 3 (My Watchlist) ── */
export type WatchStatus = "now" | "soon" | "elsewhere";

export type WatchTitle = {
  id: string;
  title: string;
  genre: string;
  rt: string;
  status: WatchStatus;
  statusLabel: string;
  platform: PlatformId;
  gradient: [string, string, string]; // poster fallback behind the image
  image?: string;
};

export const watchlist: WatchTitle[] = [
  { id: "bear", title: "The Bear", genre: "Drama", rt: "4.8", status: "now", statusLabel: "Season 3 · Available now", platform: "netflix", gradient: ["#3a0d0d", "#7a1a1a", "#c44a2a"], image: "https://media.themoviedb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg" },
  { id: "succ", title: "Succession", genre: "Drama", rt: "4.9", status: "now", statusLabel: "Complete series", platform: "now", gradient: ["#0a0a0a", "#1f1f1f", "#4a4a4a"], image: "https://media.themoviedb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg" },
  { id: "mirror", title: "Black Mirror", genre: "Sci-Fi", rt: "4.2", status: "soon", statusLabel: "Drops 24 October", platform: "netflix", gradient: ["#050505", "#1a1a3a", "#3a2a6a"], image: "https://media.themoviedb.org/t/p/w500/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg" },
  { id: "lotus", title: "The White Lotus", genre: "Drama", rt: "4.5", status: "elsewhere", statusLabel: "Only on NOW / Sky", platform: "now", gradient: ["#4a3a1a", "#a07a3a", "#e0c478"], image: "https://media.themoviedb.org/t/p/w500/gbSaK9v1CbcYH1ISgbM7XObD2dW.jpg" },
  { id: "andor-wl", title: "Andor", genre: "Sci-Fi", rt: "4.7", status: "now", statusLabel: "Both seasons streaming", platform: "disney", gradient: ["#1a1a1a", "#3a3a4a", "#7a7a8a"], image: "https://media.themoviedb.org/t/p/w500/khZqmwHQicTYoS7Flreb9EddFZC.jpg" },
  { id: "agatha-wl", title: "Agatha All Along", genre: "Fantasy", rt: "4.1", status: "now", statusLabel: "Season 1 · Available now", platform: "disney", gradient: ["#1a0a1a", "#4a1a4a", "#8a3a8a"], image: "https://media.themoviedb.org/t/p/w500/mGsxKwXUjojitRv2E9qMTbxbBRd.jpg" },
  { id: "slow-wl", title: "Slow Horses", genre: "Thriller", rt: "4.6", status: "now", statusLabel: "Four seasons streaming", platform: "appletv", gradient: ["#1a1a1a", "#3a3a3a", "#7a7a7a"], image: "https://media.themoviedb.org/t/p/w500/5RuZZIouptatjV96BdPmKmRsnGg.jpg" },
  { id: "sev-wl", title: "Severance", genre: "Sci-Fi", rt: "4.8", status: "now", statusLabel: "Season 2 · Available now", platform: "appletv", gradient: ["#0a1a2a", "#1a3a5a", "#4a7aaa"], image: "https://media.themoviedb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg" },
  { id: "bates-wl", title: "Mr Bates vs The Post Office", genre: "Drama", rt: "4.7", status: "now", statusLabel: "Limited series · Available now", platform: "itvx", gradient: ["#0a1420", "#1a2b3a", "#3a5a6a"] },
  { id: "rivals-wl", title: "Rivals", genre: "Drama", rt: "4.4", status: "soon", statusLabel: "New season this autumn", platform: "itvx", gradient: ["#2a0a1a", "#5a1a3a", "#a03a5a"] },
];

export type Recommendation = { id: string; title: string; gradient: [string, string, string]; image?: string };

export const recommendations: Recommendation[] = [
  { id: "severance", title: "Severance", gradient: ["#0a1a2a", "#1a3a5a", "#4a7aaa"], image: "https://media.themoviedb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg" },
  { id: "silo", title: "Silo", gradient: ["#1a1010", "#3a2010", "#7a5030"], image: "https://media.themoviedb.org/t/p/w500/fDMTqUcEh6qJwWZP1SHTfoaqsCy.jpg" },
  { id: "ted", title: "Ted Lasso", gradient: ["#1a2a1a", "#3a5a3a", "#a0c0a0"], image: "https://media.themoviedb.org/t/p/w500/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg" },
];

/* ── Screen 4 (News / Upcoming) — reasons-to-subscribe highlights ── */
export type UpcomingItem = {
  id: string;
  title: string;
  synopsis: string;
  release: string;
  hero: [string, string, string]; // fallback gradient behind the hero image
  image?: string;
};

export type Upcoming = {
  id: string;
  platform: PlatformId;
  items: UpcomingItem[];
};

export const upcoming: Upcoming[] = [
  {
    id: "disney-up",
    platform: "disney",
    items: [
      { id: "acolyte", title: "The Acolyte", synopsis: "An investigation into a shocking crime spree pits a respected Jedi Master against a dangerous warrior from his past.", release: "05 June", hero: ["#0a0a3a", "#1a1a6a", "#6a3a8a"], image: "https://media.themoviedb.org/t/p/w500/mztdt3y6GBsJR69zHtszFezTCLT.jpg" },
      { id: "andor", title: "Andor · Season 2", synopsis: "Cassian's path to the Rebellion accelerates as the Empire tightens its grip across the galaxy.", release: "22 April", hero: ["#1a1a1a", "#3a3a4a", "#7a7a8a"], image: "https://media.themoviedb.org/t/p/w500/khZqmwHQicTYoS7Flreb9EddFZC.jpg" },
      { id: "agatha", title: "Agatha All Along", synopsis: "Stripped of her powers, Agatha Harkness gathers a new coven to walk the Witches' Road.", release: "Streaming now", hero: ["#1a0a1a", "#4a1a4a", "#8a3a8a"], image: "https://media.themoviedb.org/t/p/w500/mGsxKwXUjojitRv2E9qMTbxbBRd.jpg" },
    ],
  },
  {
    id: "apple-up",
    platform: "appletv",
    items: [
      { id: "slow4", title: "Slow Horses · Season 4", synopsis: "Lamb's reluctant misfits return. A bomb on a London bus tips Slough House back into the cold.", release: "12 June", hero: ["#1a1a1a", "#3a3a3a", "#7a7a7a"], image: "https://media.themoviedb.org/t/p/w500/5RuZZIouptatjV96BdPmKmRsnGg.jpg" },
      { id: "severance2", title: "Severance · Season 2", synopsis: "Mark and the innies return to Lumon to face the consequences of the overtime contingency.", release: "17 January", hero: ["#0a1a2a", "#1a3a5a", "#4a7aaa"], image: "https://media.themoviedb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg" },
      { id: "pachinko2", title: "Pachinko · Season 2", synopsis: "Sunja's family saga continues across decades and continents as wartime tensions rise.", release: "23 August", hero: ["#1a1010", "#3a2010", "#7a5030"], image: "https://media.themoviedb.org/t/p/w500/Fh5Iisb8yJbA6dYJCFRb7uYfs2.jpg" },
    ],
  },
  {
    id: "para-up",
    platform: "paramount",
    items: [
      { id: "yellow", title: "Yellowstone · Season 5 Part 2", synopsis: "The Duttons fight for their land and legacy in the final chapter of the modern western saga.", release: "November", hero: ["#2a1a0a", "#7a4a1a", "#d09a3a"], image: "https://media.themoviedb.org/t/p/w500/vOYfRZ0NpUK5hG2CB2dJFnYJlGe.jpg" },
      { id: "tulsa", title: "Tulsa King · Season 2", synopsis: "Dwight Manfredi expands his Oklahoma empire while old enemies close in from New York.", release: "13 September", hero: ["#1a0a0a", "#4a1a1a", "#8a3a2a"], image: "https://media.themoviedb.org/t/p/w500/7MXg0BxuSRWz2yKc03M40du2mrc.jpg" },
      { id: "landman", title: "Landman", synopsis: "A crisis manager for an oil company navigates the modern boomtowns of West Texas.", release: "17 November", hero: ["#1a1a0a", "#4a3a1a", "#a07a3a"], image: "https://media.themoviedb.org/t/p/w500/6qfZAOEUFIrbUH3JvePclx1nXzz.jpg" },
    ],
  },
];
