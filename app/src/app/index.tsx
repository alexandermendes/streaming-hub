import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AddPlatformTile,
  PlatformLogo,
  PlatformTile,
  ScreenHeader,
  SectionLabel,
} from "@/components/streamers";
import { activeDeals, offers, platformById, platforms, type PlatformId } from "@/data/streamers";
import { colors, radius, serif, wa } from "@/theme";

const FILTERS = ["All", "Free trial", "Under £5", "Annual saver", "Bundles"];

const pressedStyle = ({ pressed }: { pressed: boolean }) => (pressed ? styles.pressed : null);

export default function HubScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [expiryModalVisible, setExpiryModalVisible] = useState(false);
  const [expiringDeal, setExpiringDeal] = useState<typeof activeDeals[number] | null>(null);

  const expiringDeals = activeDeals.filter((d) => d.endsInDays <= 7);

  useEffect(() => {
    if (expiringDeals.length > 0) {
      setExpiringDeal(expiringDeals[0]);
      setExpiryModalVisible(true);
    }
  }, []);

  const goToAdd = (platform?: PlatformId) =>
    router.push(platform ? { pathname: "/add", params: { platform } } : "/add");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Modal
        visible={expiryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExpiryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {expiringDeal && (
                <PlatformLogo p={platformById(expiringDeal.platform)} size={28} />
              )}
              <Text style={styles.modalTitle}>Subscription expiring soon</Text>
            </View>
            <Text style={styles.modalBody}>
              Your {expiringDeal ? platformById(expiringDeal.platform).name : ''} deal is about to expire
              {expiringDeal ? ` — ends in ${expiringDeal.endsInDays} day${expiringDeal.endsInDays === 1 ? '' : 's'}` : ''}.
            </Text>
            <Pressable
              onPress={() => setExpiryModalVisible(false)}
              style={({ pressed }) => [styles.modalButton, pressed && styles.pressed]}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </Pressable>
            <Pressable
              onPress={() => setExpiryModalVisible(false)}
              style={({ pressed }) => [styles.modalLink, pressed && styles.pressed]}
            >
              <Text style={styles.modalLinkText}>Unsubscribe</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Dan's Streamers" />

        {/* Active platforms rail */}
        <View style={styles.section}>
          <SectionLabel>Your active platforms</SectionLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rail}
          >
            {platforms.map((p) => (
              <PlatformTile key={p.id} p={p} onPress={() => goToAdd(p.id)} />
            ))}
            <AddPlatformTile onPress={() => goToAdd()} />
          </ScrollView>
        </View>

        {/* Active deals */}
        <View style={styles.section}>
          <SectionLabel sub="3 running this month" viewAll onViewAll={() => goToAdd()}>
            Active deals
          </SectionLabel>
          <View style={{ gap: 12 }}>
            {activeDeals.map((d) => {
              const p = platformById(d.platform);
              const urgent = d.endsInDays <= 7;
              return (
                <Pressable
                  key={d.platform}
                  onPress={() => goToAdd(d.platform)}
                  style={({ pressed }) => [styles.dealCard, pressed && styles.pressed]}
                >
                  <View style={styles.dealTop}>
                    <PlatformLogo p={p} size={36} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dealName} numberOfLines={1}>
                        {p.name}
                      </Text>
                      <Text style={styles.dealLabel}>{d.label}</Text>
                    </View>
                    <Text style={styles.dealPrice}>
                      {d.price}
                      <Text style={styles.dealPriceUnit}>/mo</Text>
                    </Text>
                  </View>
                  <View style={styles.track}>
                    <View
                      style={{
                        height: "100%",
                        borderRadius: radius.full,
                        width: `${d.progress}%`,
                        backgroundColor: urgent ? colors.urgent : colors.brand,
                      }}
                    />
                  </View>
                  <View style={styles.dealMeta}>
                    <Text style={styles.dealMetaText}>{d.started}</Text>
                    <Text style={[styles.dealMetaText, urgent && { color: colors.urgent }]}>
                      Ends in {d.endsInDays} days
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Editor's tip */}
        <Pressable
          onPress={() => goToAdd("appletv")}
          style={({ pressed }) => [styles.tipCard, pressed && styles.pressed]}
        >
          <View style={styles.tipHead}>
            <View style={styles.tipBadge}>
              <Text style={styles.tipBadgeText}>Editor's tip</Text>
            </View>
            <Text style={styles.tipDate}>12 May</Text>
          </View>
          <Text style={styles.tipTitle}>Slow Horses, Season 4</Text>
          <Text style={styles.tipBody}>
            You cancelled Apple TV+ last month — 3 shows on your watchlist drop this week.
          </Text>
          <View style={styles.tipButton}>
            <Text style={styles.tipButtonText}>Resubscribe · £8.99</Text>
          </View>
        </Pressable>

        {/* Deals & special offers */}
        <View style={[styles.section, { marginTop: 32 }]}>
          <SectionLabel sub="Find a better price across every platform" viewAll onViewAll={() => goToAdd()}>
            Deals & special offers
          </SectionLabel>

          {/* Search field */}
          <Pressable style={({ pressed }) => [styles.search, pressed && styles.pressed]}>
            <Ionicons name="search" size={16} color={wa(0.4)} />
            <Text style={styles.searchText}>Search Netflix, Disney+, deals…</Text>
            <View style={styles.livePill}>
              <Text style={styles.livePillText}>{offers.length} live</Text>
            </View>
          </Pressable>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRail}
          >
            {FILTERS.map((c) => {
              const active = c === filter;
              return (
                <Pressable
                  key={c}
                  onPress={() => setFilter(c)}
                  style={({ pressed }) => [
                    styles.chip,
                    active ? styles.chipActive : styles.chipIdle,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.chipText, { color: active ? colors.black : wa(0.7) }]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Offer cards */}
          <View style={{ gap: 12 }}>
            {offers.map((o) => {
              const p = platformById(o.platform);
              const tone =
                o.badgeTone === "hot"
                  ? { backgroundColor: colors.brand }
                  : o.badgeTone === "ending"
                    ? { backgroundColor: colors.urgent }
                    : { backgroundColor: colors.white };
              return (
                <Pressable
                  key={o.id}
                  onPress={() => goToAdd(o.platform)}
                  style={({ pressed }) => [styles.offerCard, pressed && styles.pressed]}
                >
                  <PlatformLogo p={p} size={44} />
                  <View style={{ flex: 1 }}>
                    <View style={styles.offerBadgeRow}>
                      <View style={[styles.offerBadge, tone]}>
                        <Text style={styles.offerBadgeText}>{o.badge}</Text>
                      </View>
                      <Text style={styles.offerPlatform}>{p.name}</Text>
                    </View>
                    <Text style={styles.offerHeadline} numberOfLines={1}>
                      {o.headline}
                    </Text>
                    <Text style={styles.offerDetail} numberOfLines={1}>
                      {o.detail}
                    </Text>
                  </View>
                  <View style={styles.offerRight}>
                    <Text style={styles.offerExpires}>{o.expires}</Text>
                    <Text style={styles.offerChevron}>›</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },
  section: { marginBottom: 32 },
  rail: { gap: 16, paddingVertical: 4, paddingRight: 8 },
  pressed: { opacity: 0.6 },

  dealCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: wa(0.05),
  },
  dealTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  dealName: { color: colors.white, fontSize: 14, fontWeight: "700" },
  dealLabel: { color: wa(0.5), fontSize: 11, marginTop: 1 },
  dealPrice: { color: colors.brand, fontSize: 16, fontWeight: "700" },
  dealPriceUnit: { color: colors.white, fontSize: 9, opacity: 0.5 },
  track: {
    height: 4,
    width: "100%",
    backgroundColor: wa(0.05),
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: 8,
  },
  dealMeta: { flexDirection: "row", justifyContent: "space-between" },
  dealMetaText: { color: wa(0.4), fontSize: 10, fontWeight: "500" },

  tipCard: { backgroundColor: colors.brand, padding: 20, borderRadius: radius["3xl"] },
  tipHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  tipBadge: { backgroundColor: colors.black, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  tipBadgeText: { color: colors.white, fontSize: 10, fontWeight: "600" },
  tipDate: { color: colors.black, fontSize: 11, fontWeight: "500", opacity: 0.7 },
  tipTitle: { color: colors.black, fontFamily: serif.semibold, fontSize: 26, marginBottom: 8 },
  tipBody: { color: colors.black, fontSize: 13, fontWeight: "500", opacity: 0.8, marginBottom: 20, lineHeight: 18 },
  tipButton: { backgroundColor: colors.black, borderRadius: radius.lg, paddingVertical: 12, alignItems: "center" },
  tipButtonText: { color: colors.white, fontSize: 13, fontWeight: "600" },

  search: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: wa(0.05),
    borderRadius: radius.xl,
    height: 48,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  searchText: { color: wa(0.4), fontSize: 13, flex: 1 },
  livePill: { backgroundColor: colors.brand, borderRadius: radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  livePillText: { color: colors.black, fontSize: 10, fontWeight: "600" },

  chipRail: { gap: 8, paddingBottom: 12, paddingRight: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.full, borderWidth: 1 },
  chipActive: { backgroundColor: colors.white, borderColor: colors.white },
  chipIdle: { borderColor: wa(0.15) },
  chipText: { fontSize: 11, fontWeight: "600" },

  offerCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: wa(0.05),
    borderRadius: radius.xl,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  offerBadgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  offerBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  offerBadgeText: { color: colors.black, fontSize: 9, fontWeight: "700" },
  offerPlatform: { color: wa(0.4), fontSize: 10, fontWeight: "500" },
  offerHeadline: { color: colors.white, fontSize: 14, fontWeight: "700", letterSpacing: -0.3 },
  offerDetail: { color: wa(0.5), fontSize: 11, marginTop: 1 },
  offerRight: { alignItems: "flex-end" },
  offerExpires: { color: wa(0.4), fontSize: 10, marginBottom: 4 },
  offerChevron: { color: colors.brand, fontSize: 18, lineHeight: 18 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: radius["3xl"],
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: wa(0.1),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  modalTitle: {
    color: colors.urgent,
    fontSize: 18,
    fontWeight: "700",
  },
  modalBody: {
    color: wa(0.7),
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: colors.black,
    fontSize: 13,
    fontWeight: "600",
  },
  modalLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  modalLinkText: {
    color: colors.urgent,
    fontSize: 13,
    fontWeight: "600",
  },
});
