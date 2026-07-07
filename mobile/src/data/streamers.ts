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
};

export const platforms: Platform[] = [
  { id: "netflix", name: "Netflix", short: "N", bg: "#000000", fg: "#E50914", active: true },
  { id: "disney", name: "Disney+", short: "Disney+", bg: "#0E2A6B", fg: "#ffffff", active: true },
  { id: "appletv", name: "Apple TV+", short: "tv+", bg: "#000000", fg: "#ffffff", active: true },
  { id: "itvx", name: "ITVX", short: "ITVX", bg: "#101820", fg: "#ffd400", active: true },
  { id: "paramount", name: "Paramount+", short: "P+", bg: "#0064FF", fg: "#ffffff", active: false },
  { id: "now", name: "NOW", short: "NOW", bg: "#001E3C", fg: "#00d1a6", active: false },
  { id: "prime", name: "Prime Video", short: "prime", bg: "#00A8E1", fg: "#ffffff", active: false },
];

export const platformById = (id: PlatformId) => platforms.find((p) => p.id === id)!;

export type Deal = {
  platform: PlatformId;
  label: string;
  price: string;
  progress: number; // 0..100
  started: string;
  endsInDays: number;
};

export const activeDeals: Deal[] = [
  { platform: "disney", label: "Annual promo rate", price: "£1.99", progress: 65, started: "Started 12 Jan", endsInDays: 42 },
  { platform: "appletv", label: "Free trial", price: "£0.00", progress: 80, started: "Started 25 Apr", endsInDays: 5 },
  { platform: "itvx", label: "Premium • Monthly", price: "£5.99", progress: 25, started: "Started 02 May", endsInDays: 22 },
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
  { id: "para-1", platform: "paramount", headline: "3 months for £1", detail: "Then £6.99/mo. New & returning members.", badge: "Hot deal", badgeTone: "hot", expires: "Ends Sun" },
  { id: "disney-1", platform: "disney", headline: "Annual plan · save 16%", detail: "£79.90 for 12 months on Standard with Ads.", badge: "Editor's pick", badgeTone: "new", expires: "Limited time" },
  { id: "now-1", platform: "now", headline: "Entertainment £6.99/mo", detail: "Was £9.99. First 3 months for new members.", badge: "Ending soon", badgeTone: "ending", expires: "3 days left" },
  { id: "prime-1", platform: "prime", headline: "30-day free trial", detail: "Then £8.99/mo. Includes Prime delivery.", badge: "Free trial", badgeTone: "new", expires: "Always on" },
];
