import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Platform } from "@/data/streamers";
import { colors, radius, wa } from "@/theme";

/* ─────────── Platform logo (coloured tile with short label) ─────────── */
export function PlatformLogo({ p, size = 56 }: { p: Platform; size?: number }) {
  const isWord = p.short.length > 2;
  // Size wordmark text to fit the tile width (react-native-web ignores the
  // iOS-only `adjustsFontSizeToFit`, so compute it deterministically instead).
  const fontSize = isWord
    ? Math.min(size * 0.3, (size * 0.84) / (0.62 * p.short.length))
    : size * 0.42;
  return (
    <View
      style={[
        styles.logo,
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: p.bg,
        },
        p.id === "appletv" && styles.appletvRing,
      ]}
    >
      <Text
        style={{ color: p.fg, fontWeight: "900", letterSpacing: -0.5, fontSize }}
        numberOfLines={1}
      >
        {p.short}
      </Text>
    </View>
  );
}

/* ─────────── Platform tile (logo + name, used in the rails) ─────────── */
export function PlatformTile({
  p,
  selected,
  onPress,
}: {
  p: Platform;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={p.name}
      style={({ pressed }) => [
        styles.tile,
        !p.active && styles.inactive,
        pressed && onPress && styles.pressed,
      ]}
    >
      <View style={selected ? styles.tileRing : undefined}>
        <PlatformLogo p={p} size={64} />
      </View>
      <Text style={[styles.tileLabel, { color: p.active ? wa(0.8) : wa(0.3) }]} numberOfLines={1}>
        {p.name}
      </Text>
    </Pressable>
  );
}

export function AddPlatformTile({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable style={styles.tile} onPress={onPress} accessibilityRole="button" accessibilityLabel="Add subscription">
      <View style={styles.addTile}>
        <Ionicons name="add" size={24} color={wa(0.5)} />
      </View>
      <Text style={[styles.tileLabel, { color: wa(0.6) }]}>Add</Text>
    </Pressable>
  );
}

/* ─────────── Radio Times top bar (wordmark + avatar) ─────────── */
export function RtTopBar() {
  return (
    <View style={styles.topBar}>
      <View style={{ width: 36 }} />
      <Text style={styles.wordmark}>RADIO TIMES</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>DH</Text>
      </View>
    </View>
  );
}

export function ScreenHeader({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <>
      <RtTopBar />
      <View style={{ marginBottom: 24 }}>
        {!!eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </>
  );
}

export function SectionLabel({
  children,
  sub,
  viewAll,
  onViewAll,
}: {
  children: ReactNode;
  sub?: string;
  viewAll?: boolean;
  onViewAll?: () => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>{children}</Text>
        {viewAll && (
          <Pressable onPress={onViewAll} hitSlop={8} style={({ pressed }) => pressed && { opacity: 0.6 }}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        )}
      </View>
      {!!sub && <Text style={styles.sectionSub}>{sub}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: "center", justifyContent: "center" },
  appletvRing: { borderWidth: 1, borderColor: wa(0.15) },
  tile: { alignItems: "center", gap: 8, flexShrink: 0 },
  inactive: { opacity: 0.4 },
  pressed: { opacity: 0.6 },
  tileRing: {
    borderWidth: 2,
    borderColor: colors.brand,
    borderRadius: 22,
    padding: 3,
  },
  tileLabel: { fontSize: 11, fontWeight: "500" },
  addTile: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: wa(0.2),
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  wordmark: { color: colors.white, fontSize: 15, fontWeight: "800", letterSpacing: 2 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.muted,
    borderWidth: 1,
    borderColor: wa(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.white, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  eyebrow: { color: wa(0.4), fontSize: 11, fontWeight: "500", marginBottom: 4 },
  headerTitle: { color: colors.white, fontSize: 26, fontWeight: "700", letterSpacing: -0.5 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  sectionTitle: { color: colors.white, fontSize: 16, fontWeight: "700", letterSpacing: -0.3 },
  viewAll: { color: colors.brand, fontSize: 12, fontWeight: "500" },
  sectionSub: { color: wa(0.4), fontSize: 11, marginTop: 2 },
});
