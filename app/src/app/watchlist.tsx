import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PostWatchSheet } from "@/components/post-watch-sheet";
import { PlatformTile, Poster, RtTopBar, SectionLabel } from "@/components/streamers";
import { activeDeals, platformById, platforms, watchlist, type PlatformId, type WatchTitle } from "@/data/streamers";
import { colors, radius, wa } from "@/theme";

const SECTIONS = [
  { key: "now", title: "Available now" },
  { key: "soon", title: "Coming soon" },
] as const;

export default function WatchlistScreen() {
  const dealPlatforms = platforms.filter((p) => activeDeals.some((d) => d.platform === p.id));
  const [selected, setSelected] = useState<PlatformId>(dealPlatforms[0]?.id ?? "netflix");
  const [watched, setWatched] = useState<{ title: string; subtitle: string } | null>(null);
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set());
  const [showAllNow, setShowAllNow] = useState(false);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'watched'>('watchlist');

  const handleMarkWatched = (t: WatchTitle) => {
    setWatched({ title: t.title, subtitle: t.statusLabel });
  };

  const handleSheetClose = () => {
    if (watched) {
      const item = watchlist.find((w) => w.title === watched.title);
      if (item) {
        setWatchedIds((prev) => new Set(prev).add(item.id));
      }
    }
    setWatched(null);
  };

  const watchedItems = watchlist.filter(
    (w) => watchedIds.has(w.id) && w.platform === selected,
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RtTopBar />

        <View style={{ marginBottom: 24 }}>
          <Text style={styles.title}>My Watchlist</Text>
          <Text style={styles.subtitle}>Filtered by platform</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {dealPlatforms.map((p) => (
              <PlatformTile
                key={p.id}
                p={p}
                selected={p.id === selected}
                onPress={() => setSelected(p.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabRow}>
          <Pressable
            onPress={() => setActiveTab('watchlist')}
            style={[styles.tab, activeTab === 'watchlist' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'watchlist' && styles.tabTextActive]}>
              Watchlist
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('watched')}
            style={[styles.tab, activeTab === 'watched' && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === 'watched' && styles.tabTextActive]}>
              Watched{watchedIds.size > 0 ? ` (${watchedIds.size})` : ''}
            </Text>
          </Pressable>
        </View>

        {activeTab === 'watchlist' && (
        <View style={{ gap: 32 }}>
          {SECTIONS.map((s) => {
            const allItems = watchlist.filter(
              (w) => w.status === s.key && w.platform === selected && !watchedIds.has(w.id),
            );
            const isNow = s.key === "now";
            const items = isNow && !showAllNow ? allItems.slice(0, 3) : allItems;
            return (
              <View key={s.key}>
                <SectionLabel
                  sub={`${items.length}${isNow && !showAllNow && allItems.length > 3 ? ` of ${allItems.length}` : ""} ${allItems.length === 1 ? "title" : "titles"}`}
                  viewAll={isNow}
                  viewAllLabel={showAllNow ? "View less" : "View more"}
                  onViewAll={() => setShowAllNow((v) => !v)}
                >
                  {s.title}
                </SectionLabel>
                <View style={{ gap: 20 }}>
                  {items.map((t) => (
                    <WatchRow
                      key={t.id}
                      t={t}
                      onMarkWatched={() => handleMarkWatched(t)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
        )}

        {activeTab === 'watched' && (
          <View style={{ gap: 20 }}>
            {watchedItems.length === 0 ? (
              <Text style={styles.emptyText}>
                No watched shows yet. Mark a show as watched to see it here.
              </Text>
            ) : (
              watchedItems.map((t) => (
                <View key={t.id} style={styles.row}>
                  <Poster
                    title={t.title}
                    image={t.image}
                    gradient={t.gradient}
                  />
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{t.title}</Text>
                    <View style={styles.watchedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={colors.brand} />
                      <Text style={styles.watchedText}>Watched</Text>
                    </View>
                    <Pressable
                      onPress={() => setWatchedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(t.id);
                        return next;
                      })}
                      style={({ pressed }) => [styles.moveBackBtn, pressed && styles.pressed]}
                    >
                      <Text style={styles.moveBackText}>Move to watchlist</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      <PostWatchSheet
        visible={watched !== null}
        title={watched?.title ?? ""}
        subtitle={watched?.subtitle}
        onClose={handleSheetClose}
      />
    </SafeAreaView>
  );
}

function WatchRow({ t, onMarkWatched }: { t: WatchTitle; onMarkWatched: () => void }) {
  const muted = t.status !== "now";
  return (
    <View style={[styles.row, muted && { opacity: 0.6 }]}>
      <Poster
        title={t.title}
        image={t.image}
        gradient={t.gradient}
        grayscale={t.status === "elsewhere"}
      />
      <View style={styles.rowBody}>
        <View style={styles.badgeRow}>
          <View style={[styles.rtBadge, t.status === "now" ? styles.rtNow : styles.rtMuted]}>
            <Text style={[styles.rtText, { color: t.status === "now" ? colors.black : colors.white }]}>
              RT {t.rt}
            </Text>
          </View>
          <Text style={styles.genre}>{t.genre}</Text>
        </View>
        <Text style={styles.rowTitle}>{t.title}</Text>
        <Text style={styles.rowStatus}>{t.statusLabel}</Text>

        {t.status === "now" && (
          <Pressable
            onPress={onMarkWatched}
            style={({ pressed }) => [styles.markBtn, pressed && styles.pressed]}
          >
            <Text style={styles.markText}>Mark as watched</Text>
          </Pressable>
        )}
        {t.status === "soon" && (
          <Pressable style={({ pressed }) => [styles.remindBtn, pressed && styles.pressed]}>
            <Text style={styles.remindText}>Remind me</Text>
          </Pressable>
        )}
        {t.status === "elsewhere" && (
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <Text style={styles.viewOn}>View on {platformById(t.platform).name}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  pressed: { opacity: 0.6 },

  title: { color: colors.white, fontSize: 22, fontWeight: "700", letterSpacing: -0.5, textAlign: "center", marginBottom: 4 },
  subtitle: { color: wa(0.4), fontSize: 12, textAlign: "center", marginBottom: 20 },
  rail: { gap: 16, paddingVertical: 4, paddingHorizontal: 4 },

  row: { flexDirection: "row", gap: 16 },
  rowBody: { flex: 1, justifyContent: "center" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  rtBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  rtNow: { backgroundColor: colors.brand },
  rtMuted: { backgroundColor: wa(0.1) },
  rtText: { fontSize: 10, fontWeight: "700" },
  genre: { color: wa(0.5), fontSize: 11, fontWeight: "500" },
  rowTitle: { color: colors.white, fontSize: 17, fontWeight: "700", letterSpacing: -0.3, marginBottom: 4 },
  rowStatus: { color: wa(0.5), fontSize: 12, marginBottom: 12 },

  markBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: wa(0.2),
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  markText: { color: colors.white, fontSize: 11, fontWeight: "600" },
  remindBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(184,255,61,0.5)",
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  remindText: { color: colors.brand, fontSize: 11, fontWeight: "600" },
  viewOn: { color: wa(0.5), fontSize: 11, fontWeight: "600", textDecorationLine: "underline" },

  tabRow: {
    flexDirection: "row",
    gap: 0,
    marginBottom: 24,
    borderRadius: radius.full,
    backgroundColor: wa(0.05),
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.card,
  },
  tabText: {
    color: wa(0.4),
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.white,
  },
  watchedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  watchedText: {
    color: colors.brand,
    fontSize: 11,
    fontWeight: "600",
  },
  moveBackBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: wa(0.2),
    borderRadius: radius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 8,
  },
  moveBackText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
  emptyText: {
    color: wa(0.4),
    fontSize: 13,
    textAlign: "center",
    marginTop: 32,
  },
});
