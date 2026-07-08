import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Poster } from "@/components/streamers";
import { recommendations, type PlatformId } from "@/data/streamers";
import { colors, radius, serif, wa } from "@/theme";

const PLATFORM_URL: Record<PlatformId, string> = {
  netflix:   "https://www.netflix.com",
  disney:    "https://www.disneyplus.com",
  appletv:   "https://tv.apple.com",
  itvx:      "https://www.itv.com/itvx",
  paramount: "https://www.paramountplus.com/gb/",
  now:       "https://www.nowtv.com",
  prime:     "https://www.amazon.co.uk/prime-video",
};

const PLATFORM_NAME: Record<PlatformId, string> = {
  netflix:   "Netflix",
  disney:    "Disney+",
  appletv:   "Apple TV+",
  itvx:      "ITVX",
  paramount: "Paramount+",
  now:       "NOW",
  prime:     "Prime Video",
};

const RATING_LABEL = ["", "Not for me", "It was OK", "Good", "Loved it", "Loved it"];

export function PostWatchSheet({
  visible,
  onClose,
  title,
  subtitle = "Season 3 · 6 episodes",
  platform = "appletv",
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  platform?: PlatformId;
}) {
  const [rating, setRating] = useState(4);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}>
          <View style={styles.handle} />

          <Text style={styles.finished}>You've finished</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Rating */}
          <View style={styles.card}>
            <Text style={styles.rateLabel}>Rate this season</Text>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n)} hitSlop={4} style={{ padding: 2 }}>
                  <Ionicons
                    name={n <= rating ? "star" : "star-outline"}
                    size={28}
                    color={n <= rating ? colors.brand : wa(0.25)}
                  />
                </Pressable>
              ))}
            </View>
            <View style={styles.rateFooter}>
              <Text style={styles.rateValue}>
                {rating} / 5 · {RATING_LABEL[rating]}
              </Text>
              <Text style={styles.dot}>·</Text>
              <Text style={styles.addNote}>Add a note</Text>
            </View>
          </View>

          {/* RT verdict */}
          <View style={styles.card}>
            <View style={styles.verdictHead}>
              <View style={styles.verdictBadge}>
                <Text style={styles.verdictBadgeText}>RT verdict</Text>
              </View>
              <Text style={styles.verdictMeta}>Now unlocked · spoiler-safe</Text>
            </View>
            <Text style={styles.verdictQuote}>
              “A masterclass in shabbiness and sharp wit. Oldman continues to redefine the spy genre
              by doing less — and meaning more.”
            </Text>
            <Text style={styles.verdictBy}>David Butcher · Radio Times</Text>
          </View>

          {/* Watch next */}
          <Text style={styles.watchNext}>Watch next on {PLATFORM_NAME[platform]}</Text>
          <View style={styles.recRow}>
            {recommendations.map((r) => (
              <View key={r.id} style={styles.recItem}>
                <Poster title={r.title} image={r.image} gradient={r.gradient} size="sm" />
                <Text style={styles.recTitle}>{r.title}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Text style={styles.primaryBtnText}>Mark as Watched</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(PLATFORM_URL[platform])}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.dismiss}>See all on {PLATFORM_NAME[platform]}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.7)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "90%",
    backgroundColor: colors.card,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderTopWidth: 1,
    borderColor: wa(0.1),
  },
  sheetContent: { paddingHorizontal: 28, paddingTop: 12, paddingBottom: 40 },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: wa(0.15), alignSelf: "center", marginBottom: 28 },
  pressed: { opacity: 0.6 },

  finished: { color: colors.brand, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 4 },
  title: { color: colors.white, fontFamily: serif.semibold, fontSize: 30, textAlign: "center", marginBottom: 4 },
  subtitle: { color: wa(0.5), fontSize: 12, textAlign: "center", marginBottom: 28 },

  card: {
    backgroundColor: colors.bg,
    padding: 20,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    marginBottom: 20,
  },
  rateLabel: { color: wa(0.6), fontSize: 12, fontWeight: "600", textAlign: "center", marginBottom: 12 },
  stars: { flexDirection: "row", justifyContent: "center", gap: 6, marginBottom: 12 },
  rateFooter: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  rateValue: { color: colors.brand, fontSize: 11, fontWeight: "600" },
  dot: { color: wa(0.2), fontSize: 11 },
  addNote: { color: wa(0.4), fontSize: 11, textDecorationLine: "underline" },

  verdictHead: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  verdictBadge: { backgroundColor: colors.brand, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  verdictBadgeText: { color: colors.black, fontSize: 10, fontWeight: "700" },
  verdictMeta: { color: wa(0.4), fontSize: 11, fontWeight: "500" },
  verdictQuote: { color: wa(0.9), fontFamily: serif.medium, fontSize: 17, lineHeight: 23 },
  verdictBy: { color: wa(0.4), fontSize: 11, fontWeight: "500", marginTop: 12 },

  watchNext: { color: colors.white, fontSize: 16, fontWeight: "700", letterSpacing: -0.3, marginBottom: 12 },
  recRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  recItem: { flex: 1, gap: 8 },
  recTitle: { color: colors.white, fontSize: 11, fontWeight: "600", lineHeight: 14 },

  primaryBtn: { backgroundColor: colors.brand, borderRadius: radius.xl, paddingVertical: 14, alignItems: "center", marginBottom: 8 },
  primaryBtnText: { color: colors.black, fontSize: 13, fontWeight: "600" },
  dismiss: { color: wa(0.5), fontSize: 13, fontWeight: "500", textAlign: "center", paddingVertical: 12 },
});
