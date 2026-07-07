import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PlatformLogo, RtTopBar } from "@/components/streamers";
import { platformById, upcoming, type Upcoming } from "@/data/streamers";
import { colors, radius, wa } from "@/theme";

const SCRIM = ["rgba(0,0,0,0.06)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.88)"] as const;

export default function NewsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RtTopBar />
        <View style={{ marginBottom: 24 }}>
          <Text style={styles.eyebrow}>This month</Text>
          <Text style={styles.h1}>Reasons to subscribe — upcoming highlights</Text>
        </View>

        {upcoming.map((up) => (
          <UpcomingCard key={up.id} up={up} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function UpcomingCard({ up }: { up: Upcoming }) {
  const { width } = useWindowDimensions();
  const [w, setW] = useState(width - 48); // card inner width (content padding is 24 each side)
  const [idx, setIdx] = useState(0);
  const p = platformById(up.platform);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIdx(Math.round(e.nativeEvent.contentOffset.x / w));

  return (
    <View style={{ marginBottom: 32 }}>
      <View style={styles.cardHead}>
        <View style={styles.cardHeadLeft}>
          <PlatformLogo p={p} size={24} />
          <Text style={styles.platformName}>{p.name}</Text>
        </View>
        <Text style={[styles.status, { color: p.active ? colors.brand : wa(0.4) }]}>
          {p.active ? "● Active" : "○ Lapsed"}
        </Text>
      </View>

      <View style={[styles.card, !p.active && { opacity: 0.85 }]}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onLayout={(e) => setW(e.nativeEvent.layout.width)}
          onMomentumScrollEnd={onScrollEnd}
        >
          {up.items.map((it) => (
            <View key={it.id} style={{ width: w }}>
              <View style={{ width: w, aspectRatio: 16 / 10 }}>
                <LinearGradient
                  colors={it.hero}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
                {it.image && (
                  <Image
                    source={{ uri: it.image }}
                    style={[StyleSheet.absoluteFill, !p.active && { opacity: 0.55 }]}
                    contentFit="cover"
                    transition={200}
                  />
                )}
                <LinearGradient colors={SCRIM} style={StyleSheet.absoluteFill} />
                <View style={styles.heroFooter}>
                  <Text style={styles.heroTitle} numberOfLines={2}>
                    {it.title}
                  </Text>
                  <Text style={styles.heroRelease}>{it.release}</Text>
                </View>
              </View>
              <View style={styles.synopsisWrap}>
                <Text style={styles.synopsis}>{it.synopsis}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination dots */}
        <View style={styles.dots}>
          {up.items.map((it, i) => (
            <View key={it.id} style={[styles.dot, i === idx ? styles.dotActive : styles.dotIdle]} />
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {p.active ? (
            <View style={styles.actionRow}>
              <Pressable style={({ pressed }) => [styles.btnGhost, pressed && styles.pressed]}>
                <Text style={styles.btnGhostText}>Save</Text>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.btnBrand, pressed && styles.pressed]}>
                <Text style={styles.btnBrandText}>Remind me</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <View style={styles.note}>
                <View style={styles.noteDot} />
                <Text style={styles.noteText}>
                  You had {p.name} before — 4 titles on your watchlist live there.
                </Text>
              </View>
              <Pressable style={({ pressed }) => [styles.btnResub, pressed && styles.pressed]}>
                <Text style={styles.btnResubText}>Resubscribe · from £6.99</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  pressed: { opacity: 0.6 },

  eyebrow: { color: wa(0.4), fontSize: 11, fontWeight: "500", marginBottom: 4 },
  h1: { color: colors.white, fontSize: 26, fontWeight: "700", letterSpacing: -0.5, lineHeight: 30 },

  cardHead: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  cardHeadLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  platformName: { color: colors.white, fontSize: 13, fontWeight: "600" },
  status: { fontSize: 11, fontWeight: "600" },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: wa(0.05),
    overflow: "hidden",
  },
  heroFooter: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  heroTitle: { flex: 1, color: colors.white, fontSize: 20, fontWeight: "700", letterSpacing: -0.4 },
  heroRelease: { color: wa(0.8), fontSize: 11, fontWeight: "500" },
  synopsisWrap: { paddingHorizontal: 16, paddingTop: 16 },
  synopsis: { color: wa(0.6), fontSize: 13, lineHeight: 19, minHeight: 56 },

  dots: { flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: 12 },
  dot: { height: 6, borderRadius: radius.full },
  dotActive: { width: 16, backgroundColor: wa(0.8) },
  dotIdle: { width: 6, backgroundColor: wa(0.25) },

  actions: { paddingHorizontal: 16, paddingBottom: 16 },
  actionRow: { flexDirection: "row", gap: 8 },
  btnGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.xl,
    backgroundColor: wa(0.1),
    borderWidth: 1,
    borderColor: wa(0.05),
    alignItems: "center",
  },
  btnGhostText: { color: colors.white, fontSize: 12, fontWeight: "600" },
  btnBrand: { flex: 1, paddingVertical: 12, borderRadius: radius.xl, backgroundColor: colors.brand, alignItems: "center" },
  btnBrandText: { color: colors.black, fontSize: 12, fontWeight: "600" },

  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: wa(0.03),
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: wa(0.1),
  },
  noteDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.brand, marginTop: 6 },
  noteText: { flex: 1, color: wa(0.6), fontSize: 12, lineHeight: 18 },
  btnResub: {
    paddingVertical: 12,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.25),
    alignItems: "center",
  },
  btnResubText: { color: colors.brand, fontSize: 12, fontWeight: "600" },
});
