import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PlatformLogo, Poster, SectionLabel } from "@/components/streamers";
import { activeDeals, platformById, upcoming, watchlist } from "@/data/streamers";
import { colors, radius, serif, wa } from "@/theme";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "£1.99", or "Free" when the promo is £0. */
const gbp = (n: number) => (n <= 0.001 ? "Free" : `£${n.toFixed(2)}`);

export default function DealScreen() {
  const router = useRouter();
  const { platform } = useLocalSearchParams<{ platform?: string }>();
  const deal = activeDeals.find((d) => d.platform === platform);

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate("/"));

  if (!deal) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.topBar}>
          <Pressable onPress={goBack} hitSlop={8} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.white} />
            <Text style={styles.backText}>Subscriptions</Text>
          </Pressable>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>This deal is no longer active.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const p = platformById(deal.platform);
  const urgent = deal.endsInDays <= 7;
  const accent = urgent ? colors.urgent : colors.brand;

  // Send the user to the provider's own manage/cancel page (in-app browser).
  const openCancel = () => WebBrowser.openBrowserAsync(p.cancelUrl);

  // The design stores a relative countdown; turn it into a concrete end date.
  const end = new Date();
  end.setDate(end.getDate() + deal.endsInDays);
  const endLabel = `${DAYS[end.getDay()]} ${end.getDate()} ${MONTHS[end.getMonth()]}`;

  const fullPrice = p.pricePerMonth; // what it reverts to once the deal lapses
  const increase = Math.max(0, fullPrice - deal.priceNum);
  const willChange = increase > 0.001;
  const annualAfter = fullPrice * 12;

  const fromWatchlist = watchlist.filter((w) => w.platform === deal.platform);
  const comingSoon = upcoming.find((u) => u.platform === deal.platform)?.items ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable onPress={goBack} hitSlop={8} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color={colors.white} />
            <Text style={styles.backText}>Subscriptions</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push({ pathname: "/add", params: { platform: deal.platform } })}
            hitSlop={8}
          >
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <LinearGradient
            colors={[p.bg, colors.card]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroInner}>
            <PlatformLogo p={p} size={72} />
            <Text style={styles.heroEyebrow}>Your active deal</Text>
            <Text style={styles.heroTitle}>{p.name}</Text>
            <View style={[styles.dealPill, { borderColor: accent }]}>
              <Text style={[styles.dealPillText, { color: accent }]}>{deal.label}</Text>
            </View>
          </View>
        </View>

        {/* Countdown */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>Deal ends in</Text>
              <Text style={[styles.bigDays, { color: accent }]}>
                {deal.endsInDays}
                <Text style={styles.bigDaysUnit}> days</Text>
              </Text>
              <Text style={styles.subtle}>
                {deal.started} · ends {endLabel}
              </Text>
            </View>
            <View style={[styles.countIcon, { borderColor: accent }]}>
              <Ionicons name={urgent ? "alarm-outline" : "time-outline"} size={24} color={accent} />
            </View>
          </View>
          <View style={styles.track}>
            <View
              style={{
                height: "100%",
                borderRadius: radius.full,
                width: `${deal.progress}%`,
                backgroundColor: accent,
              }}
            />
          </View>
          {urgent && (
            <Text style={styles.urgentNote}>
              Ending soon — decide before {endLabel} to avoid the full charge.
            </Text>
          )}
        </View>

        {/* What you'll pay */}
        <View style={styles.card}>
          <Text style={styles.kicker}>What you'll pay</Text>
          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <Text style={[styles.price, { color: colors.brand }]}>
                {gbp(deal.priceNum)}
                <Text style={styles.perMo}>/mo</Text>
              </Text>
              <Text style={styles.priceCaption}>Now</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={wa(0.3)} />
            <View style={styles.priceCol}>
              <Text style={[styles.price, { color: willChange ? colors.white : colors.brand }]}>
                {gbp(fullPrice)}
                <Text style={styles.perMo}>/mo</Text>
              </Text>
              <Text style={styles.priceCaption}>From {endLabel}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {willChange ? (
            <Text style={styles.changeText}>
              That's <Text style={styles.increase}>+£{increase.toFixed(2)}/mo</Text> when the deal
              ends — about £{annualAfter.toFixed(2)} a year if you keep it.
            </Text>
          ) : (
            <Text style={styles.changeText}>
              Good news — your price stays the same when this term renews.
            </Text>
          )}
        </View>

        {/* From your watchlist */}
        <View style={styles.section}>
          <SectionLabel
            sub={
              fromWatchlist.length
                ? `${fromWatchlist.length} ${fromWatchlist.length === 1 ? "title" : "titles"} on ${p.name}`
                : undefined
            }
          >
            From your watchlist
          </SectionLabel>
          {fromWatchlist.length ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {fromWatchlist.map((t) => (
                <View key={t.id} style={styles.posterCol}>
                  <Poster title={t.title} image={t.image} gradient={t.gradient} />
                  <Text style={styles.posterName} numberOfLines={1}>
                    {t.title}
                  </Text>
                  <Text style={styles.posterMeta} numberOfLines={1}>
                    {t.statusLabel}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>
                Nothing from your watchlist is on {p.name} yet.
              </Text>
            </View>
          )}
        </View>

        {/* Worth staying for */}
        {comingSoon.length > 0 && (
          <View style={styles.section}>
            <SectionLabel sub={`New & coming to ${p.name}`}>Worth staying for</SectionLabel>
            <View style={{ gap: 12 }}>
              {comingSoon.map((it) => (
                <View key={it.id} style={styles.upRow}>
                  <View style={styles.upThumb}>
                    <LinearGradient
                      colors={it.hero}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                    {it.image && (
                      <Image
                        source={{ uri: it.image }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                        transition={200}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.upTitle} numberOfLines={1}>
                      {it.title}
                    </Text>
                    <Text style={styles.upSyn} numberOfLines={2}>
                      {it.synopsis}
                    </Text>
                    <Text style={styles.upRelease}>{it.release}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={goBack}
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
          >
            <Ionicons name="notifications-outline" size={16} color={colors.black} />
            <Text style={styles.primaryText}>Remind me before it ends</Text>
          </Pressable>
          <Pressable
            onPress={openCancel}
            style={({ pressed }) => [styles.ghostBtn, pressed && styles.pressed]}
          >
            <Ionicons name="open-outline" size={14} color={colors.urgent} />
            <Text style={styles.ghostText}>Cancel on {p.name}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 48 },
  pressed: { opacity: 0.6 },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: { flexDirection: "row", alignItems: "center", marginLeft: -4 },
  backText: { color: colors.white, fontSize: 15, fontWeight: "500" },
  edit: { color: colors.brand, fontSize: 15, fontWeight: "600" },

  hero: {
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: wa(0.08),
    overflow: "hidden",
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  heroInner: { alignItems: "center", gap: 10 },
  heroEyebrow: {
    color: wa(0.55),
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 4,
  },
  heroTitle: { color: colors.white, fontFamily: serif.semibold, fontSize: 32 },
  dealPill: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 2,
  },
  dealPillText: { fontSize: 12, fontWeight: "700" },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius["3xl"],
    borderWidth: 1,
    borderColor: wa(0.05),
    padding: 20,
    marginBottom: 16,
  },
  kicker: {
    color: wa(0.5),
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  bigDays: { fontSize: 40, fontWeight: "800", letterSpacing: -1, lineHeight: 44 },
  bigDaysUnit: { color: wa(0.4), fontSize: 16, fontWeight: "600" },
  subtle: { color: wa(0.4), fontSize: 12, marginTop: 4 },
  countIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    height: 8,
    width: "100%",
    backgroundColor: wa(0.05),
    borderRadius: radius.full,
    overflow: "hidden",
    marginTop: 16,
  },
  urgentNote: { color: colors.urgent, fontSize: 12, fontWeight: "500", marginTop: 12 },

  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceCol: { flex: 1, alignItems: "center", gap: 4 },
  price: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  perMo: { color: wa(0.35), fontSize: 12, fontWeight: "500" },
  priceCaption: { color: wa(0.45), fontSize: 11, fontWeight: "500" },
  divider: { height: 1, backgroundColor: wa(0.06), marginVertical: 16 },
  changeText: { color: wa(0.7), fontSize: 13, lineHeight: 19, textAlign: "center" },
  increase: { color: colors.urgent, fontWeight: "700" },

  section: { marginTop: 12, marginBottom: 16 },
  rail: { gap: 14, paddingVertical: 4, paddingRight: 8 },
  posterCol: { width: 96, gap: 6 },
  posterName: { color: colors.white, fontSize: 12, fontWeight: "700" },
  posterMeta: { color: wa(0.4), fontSize: 10 },

  upRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    padding: 12,
  },
  upThumb: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.muted,
  },
  upTitle: { color: colors.white, fontSize: 14, fontWeight: "700" },
  upSyn: { color: wa(0.5), fontSize: 11, lineHeight: 15, marginTop: 2 },
  upRelease: { color: colors.brand, fontSize: 11, fontWeight: "600", marginTop: 4 },

  emptyCard: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    padding: 20,
  },
  emptyCardText: { color: wa(0.5), fontSize: 13, textAlign: "center" },

  actions: { gap: 12, marginTop: 8 },
  primaryBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.lg,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { color: colors.black, fontSize: 14, fontWeight: "700" },
  ghostBtn: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  ghostText: { color: colors.urgent, fontSize: 13, fontWeight: "600" },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { color: wa(0.5), fontSize: 14 },
});
