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
  /** simpleicons.org slug; null = no brand icon available, fall back to wordmark */
  iconSlug: string | null;
  /** hex (no #) for the icon fill on cdn.simpleicons.org */
  iconColor: string;
  /** optional override URL (used when simpleicons doesn't host the brand) */
  iconUrl?: string;
};

export const platforms: Platform[] = [
  { id: "netflix",   name: "Netflix",     short: "N",       bg: "#000000", fg: "#E50914", active: true,  iconSlug: "netflix",       iconColor: "E50914" },
  { id: "disney",    name: "Disney+",     short: "Disney+", bg: "#0E2A6B", fg: "#ffffff", active: true,  iconSlug: null,            iconColor: "ffffff", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg" },
  { id: "appletv",   name: "Apple TV+",   short: "tv+",     bg: "#000000", fg: "#ffffff", active: true,  iconSlug: "appletv",       iconColor: "ffffff" },
  { id: "itvx",      name: "ITVX",        short: "ITVX",    bg: "#101820", fg: "#ffd400", active: true,  iconSlug: "itvx",          iconColor: "ffffff" },
  { id: "paramount", name: "Paramount+",  short: "P+",      bg: "#0064FF", fg: "#ffffff", active: false, iconSlug: "paramountplus", iconColor: "ffffff" },
  { id: "now",       name: "NOW",         short: "NOW",     bg: "#001E3C", fg: "#00d1a6", active: false, iconSlug: null,            iconColor: "ffffff" },
  { id: "prime",     name: "Prime Video", short: "prime",   bg: "#00A8E1", fg: "#ffffff", active: false, iconSlug: null,            iconColor: "ffffff", iconUrl: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg" },
];

export const platformById = (id: PlatformId) =>
  platforms.find((p) => p.id === id)!;

export type Deal = {
  platform: PlatformId;
  label: string;
  price: string;
  progress: number; // 0..100
  started: string;
  endsInDays: number;
};

export const activeDeals: Deal[] = [
  { platform: "disney",  label: "Annual promo rate", price: "£1.99", progress: 65, started: "Started 12 Jan", endsInDays: 42 },
  { platform: "appletv", label: "Free trial",        price: "£0.00", progress: 80, started: "Started 25 Apr", endsInDays: 5 },
  { platform: "itvx",    label: "Premium • Monthly", price: "£5.99", progress: 25, started: "Started 02 May", endsInDays: 22 },
];

export type WatchTitle = {
  id: string;
  title: string;
  genre: string;
  rt: string;
  status: "now" | "soon" | "elsewhere";
  statusLabel: string;
  platform: PlatformId;
  gradient: string; // poster background
  image?: string; // optional poster image (TMDB)
};

export const watchlist: WatchTitle[] = [
  { id: "bear",     title: "The Bear",       genre: "Drama",   rt: "4.8", status: "now",       statusLabel: "Season 3 · Available now", platform: "netflix",   gradient: "linear-gradient(135deg,#3a0d0d,#7a1a1a 60%,#c44a2a)", image: "https://media.themoviedb.org/t/p/w500/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg" },
  { id: "mirror",   title: "Black Mirror",   genre: "Sci-Fi",  rt: "4.2", status: "soon",      statusLabel: "Drops 24 October",          platform: "netflix",   gradient: "linear-gradient(135deg,#050505,#1a1a3a 60%,#3a2a6a)", image: "https://media.themoviedb.org/t/p/w500/seN6rRfN0I6n8iDXjlSMk1QjNcq.jpg" },
  { id: "lotus",    title: "The White Lotus",genre: "Drama",   rt: "4.5", status: "elsewhere", statusLabel: "Only on NOW / Sky",          platform: "now",       gradient: "linear-gradient(135deg,#4a3a1a,#a07a3a 60%,#e0c478)", image: "https://media.themoviedb.org/t/p/w500/gbSaK9v1CbcYH1ISgbM7XObD2dW.jpg" },
  { id: "succ",     title: "Succession",     genre: "Drama",   rt: "4.9", status: "now",       statusLabel: "Complete series",            platform: "now",       gradient: "linear-gradient(135deg,#0a0a0a,#1f1f1f 60%,#4a4a4a)", image: "https://media.themoviedb.org/t/p/w500/z0XiwdrCQ9yVIr4O0pxzaAYRxdW.jpg" },
];

export type Upcoming = {
  id: string;
  platform: PlatformId;
  items: UpcomingItem[];
};

export type UpcomingItem = {
  id: string;
  title: string;
  synopsis: string;
  release: string;
  hero: string;
  image?: string;
};

export const upcoming: Upcoming[] = [
  {
    id: "disney-up",
    platform: "disney",
    items: [
      {
        id: "acolyte",
        title: "The Acolyte",
        synopsis: "An investigation into a shocking crime spree pits a respected Jedi Master against a dangerous warrior from his past.",
        release: "05 June",
        hero: "linear-gradient(135deg,#0a0a3a,#1a1a6a 50%,#6a3a8a)",
        image: "https://media.themoviedb.org/t/p/w500/mztdt3y6GBsJR69zHtszFezTCLT.jpg",
      },
      {
        id: "andor",
        title: "Andor · Season 2",
        synopsis: "Cassian's path to the Rebellion accelerates as the Empire tightens its grip across the galaxy.",
        release: "22 April",
        hero: "linear-gradient(135deg,#1a1a1a,#3a3a4a 60%,#7a7a8a)",
        image: "https://media.themoviedb.org/t/p/w500/khZqmwHQicTYoS7Flreb9EddFZC.jpg",
      },
      {
        id: "agatha",
        title: "Agatha All Along",
        synopsis: "Stripped of her powers, Agatha Harkness gathers a new coven to walk the Witches' Road.",
        release: "Streaming now",
        hero: "linear-gradient(135deg,#1a0a1a,#4a1a4a 60%,#8a3a8a)",
        image: "https://media.themoviedb.org/t/p/w500/mGsxKwXUjojitRv2E9qMTbxbBRd.jpg",
      },
    ],
  },
  {
    id: "apple-up",
    platform: "appletv",
    items: [
      {
        id: "slow4",
        title: "Slow Horses · Season 4",
        synopsis: "Lamb's reluctant misfits return. A bomb on a London bus tips Slough House back into the cold.",
        release: "12 June",
        hero: "linear-gradient(135deg,#1a1a1a,#3a3a3a 60%,#7a7a7a)",
        image: "https://media.themoviedb.org/t/p/w500/5RuZZIouptatjV96BdPmKmRsnGg.jpg",
      },
      {
        id: "severance2",
        title: "Severance · Season 2",
        synopsis: "Mark and the innies return to Lumon to face the consequences of the overtime contingency.",
        release: "17 January",
        hero: "linear-gradient(135deg,#0a1a2a,#1a3a5a 60%,#4a7aaa)",
        image: "https://media.themoviedb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg",
      },
      {
        id: "pachinko2",
        title: "Pachinko · Season 2",
        synopsis: "Sunja's family saga continues across decades and continents as wartime tensions rise.",
        release: "23 August",
        hero: "linear-gradient(135deg,#1a1010,#3a2010 60%,#7a5030)",
        image: "https://media.themoviedb.org/t/p/w500/Fh5Iisb8yJbA6dYJCFRb7uYfs2.jpg",
      },
    ],
  },
  {
    id: "para-up",
    platform: "paramount",
    items: [
      {
        id: "yellow",
        title: "Yellowstone · Season 5 Part 2",
        synopsis: "The Duttons fight for their land and legacy in the final chapter of the modern western saga.",
        release: "November",
        hero: "linear-gradient(135deg,#2a1a0a,#7a4a1a 60%,#d09a3a)",
        image: "https://media.themoviedb.org/t/p/w500/vOYfRZ0NpUK5hG2CB2dJFnYJlGe.jpg",
      },
      {
        id: "tulsa",
        title: "Tulsa King · Season 2",
        synopsis: "Dwight Manfredi expands his Oklahoma empire while old enemies close in from New York.",
        release: "13 September",
        hero: "linear-gradient(135deg,#1a0a0a,#4a1a1a 60%,#8a3a2a)",
        image: "https://media.themoviedb.org/t/p/w500/7MXg0BxuSRWz2yKc03M40du2mrc.jpg",
      },
      {
        id: "landman",
        title: "Landman",
        synopsis: "A crisis manager for an oil company navigates the modern boomtowns of West Texas.",
        release: "17 November",
        hero: "linear-gradient(135deg,#1a1a0a,#4a3a1a 60%,#a07a3a)",
        image: "https://media.themoviedb.org/t/p/w500/6qfZAOEUFIrbUH3JvePclx1nXzz.jpg",
      },
    ],
  },
];

export const recommendations = [
  { id: "severance", title: "Severance",  gradient: "linear-gradient(135deg,#0a1a2a,#1a3a5a 60%,#4a7aaa)", image: "https://media.themoviedb.org/t/p/w500/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg" },
  { id: "silo",      title: "Silo",       gradient: "linear-gradient(135deg,#1a1010,#3a2010 60%,#7a5030)", image: "https://media.themoviedb.org/t/p/w500/fDMTqUcEh6qJwWZP1SHTfoaqsCy.jpg" },
  { id: "ted",       title: "Ted Lasso",  gradient: "linear-gradient(135deg,#1a2a1a,#3a5a3a 60%,#a0c0a0)", image: "https://media.themoviedb.org/t/p/w500/5fhZdwP1DVJ0FyVH6vrFdHwpXIn.jpg" },
];

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
  {
    id: "para-1",
    platform: "paramount",
    headline: "3 months for £1",
    detail: "Then £6.99/mo. New & returning members.",
    badge: "Hot deal",
    badgeTone: "hot",
    expires: "Ends Sun",
  },
  {
    id: "disney-1",
    platform: "disney",
    headline: "Annual plan · save 16%",
    detail: "£79.90 for 12 months on Standard with Ads.",
    badge: "Editor's pick",
    badgeTone: "new",
    expires: "Limited time",
  },
  {
    id: "now-1",
    platform: "now",
    headline: "Entertainment £6.99/mo",
    detail: "Was £9.99. First 3 months for new members.",
    badge: "Ending soon",
    badgeTone: "ending",
    expires: "3 days left",
  },
  {
    id: "prime-1",
    platform: "prime",
    headline: "30-day free trial",
    detail: "Then £8.99/mo. Includes Prime delivery.",
    badge: "Free trial",
    badgeTone: "new",
    expires: "Always on",
  },
];