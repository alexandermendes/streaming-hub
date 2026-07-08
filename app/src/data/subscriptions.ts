import { useSyncExternalStore } from "react";

import { activeDeals, platforms, type Deal, type PlatformId } from "@/data/streamers";

const STORAGE_KEY = "rt-streamers.saved-subscriptions.v1";

const platformIds = new Set<PlatformId>(platforms.map((p) => p.id));
const listeners = new Set<() => void>();

const isPlatformId = (value: unknown): value is PlatformId =>
  typeof value === "string" && platformIds.has(value as PlatformId);

const asFiniteNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const normalizeDeal = (value: unknown): Deal | null => {
  if (!value || typeof value !== "object") return null;

  const deal = value as Record<string, unknown>;
  const platform = deal.platform;
  const priceNum = asFiniteNumber(deal.priceNum);
  const progress = asFiniteNumber(deal.progress);
  const endsInDays = asFiniteNumber(deal.endsInDays);

  if (!isPlatformId(platform) || priceNum === null || progress === null || endsInDays === null) {
    return null;
  }

  const label = typeof deal.label === "string" && deal.label.trim()
    ? deal.label.trim()
    : "Saved subscription";
  const price = typeof deal.price === "string" && deal.price.trim()
    ? deal.price.trim()
    : `£${priceNum.toFixed(2)}`;
  const started = typeof deal.started === "string" && deal.started.trim()
    ? deal.started.trim()
    : "Started today";

  return {
    platform,
    label,
    price,
    priceNum,
    progress: Math.round(clamp(progress, 0, 100)),
    started,
    endsInDays: Math.max(0, Math.round(endsInDays)),
  };
};

const readStoredDeals = (): Deal[] => {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.flatMap((item) => {
      const deal = normalizeDeal(item);
      return deal ? [deal] : [];
    });
  } catch {
    return [];
  }
};

const writeStoredDeals = (deals: Deal[]) => {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(deals));
  } catch {
    // Native builds may not expose localStorage; in-memory state still works.
  }
};

const mergeDeals = (savedDeals: Deal[]) => {
  const savedByPlatform = new Map(savedDeals.map((deal) => [deal.platform, deal]));
  const baseDeals = activeDeals.map((deal) => savedByPlatform.get(deal.platform) ?? deal);
  const addedDeals = savedDeals.filter(
    (deal) => !activeDeals.some((baseDeal) => baseDeal.platform === deal.platform),
  );

  return [...baseDeals, ...addedDeals];
};

let savedDeals = readStoredDeals();
let activeDealsSnapshot = mergeDeals(savedDeals);

const getSnapshot = () => activeDealsSnapshot;
const getLatestSavedPlatformSnapshot = () => savedDeals[0]?.platform ?? null;

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const emit = () => {
  listeners.forEach((listener) => listener());
};

export function useActiveDeals() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useLatestSavedPlatform() {
  return useSyncExternalStore(
    subscribe,
    getLatestSavedPlatformSnapshot,
    getLatestSavedPlatformSnapshot,
  );
}

export function saveSubscription(deal: Deal) {
  savedDeals = [deal, ...savedDeals.filter((savedDeal) => savedDeal.platform !== deal.platform)];
  activeDealsSnapshot = mergeDeals(savedDeals);
  writeStoredDeals(savedDeals);
  emit();
}
