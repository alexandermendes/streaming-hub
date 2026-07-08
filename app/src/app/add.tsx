import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PlatformLogo, RtTopBar } from "@/components/streamers";
import { platformById, platforms, type PlatformId } from "@/data/streamers";
import { colors, radius, wa } from "@/theme";

const isPlatformId = (v: unknown): v is PlatformId => platforms.some((p) => p.id === v);

type DealType = "trial" | "promo" | "full";
type BillingCycle = "monthly" | "annual";
type LeadDays = 3 | 5 | 7;
type ActivePicker = "start" | "end" | "cancel" | null;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const pad = (n: number) => String(n).padStart(2, "0");
const formatDate = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const maskPriceInput = (input: string) => {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  const value = Number(digits) / 100;
  return value.toFixed(2);
};

const defaultStartDate = new Date();
const defaultEndDate = new Date(defaultStartDate);
defaultEndDate.setDate(defaultEndDate.getDate() + 7);
const defaultCancelReminderDate = new Date();
defaultCancelReminderDate.setDate(defaultCancelReminderDate.getDate() + 30);

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const { platform } = useLocalSearchParams<{ platform?: string }>();
  const [selectedId, setSelectedId] = useState<PlatformId>(
    isPlatformId(platform) ? platform : "paramount",
  );

  // Keep selection in sync when arriving from a Home tap (the Add tab may
  // already be mounted, so the initial state above won't re-run).
  useEffect(() => {
    if (isPlatformId(platform)) setSelectedId(platform);
  }, [platform]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [dealType, setDealType] = useState<DealType>("trial");
  const [leadDays, setLeadDays] = useState<LeadDays>(5);
  const [notify, setNotify] = useState(false);
  const [picker, setPicker] = useState<ActivePicker>(null);
  const [cancelReminderDate, setCancelReminderDate] = useState(defaultCancelReminderDate);
  const [fullBillingCycle, setFullBillingCycle] = useState<BillingCycle>("monthly");
  const [monthlyCost, setMonthlyCost] = useState("6.99");
  const [annualCost, setAnnualCost] = useState("69.99");
  const [afterTrialCost, setAfterTrialCost] = useState("6.99");
  const [promoCost, setPromoCost] = useState("2.99");
  const [afterPromoCost, setAfterPromoCost] = useState("6.99");

  useEffect(() => {
    if (dealType === "full") setPicker(null);
  }, [dealType]);

  useEffect(() => {
    if (!notify && picker === "cancel") setPicker(null);
  }, [notify, picker]);

  const selected = platformById(selectedId);

  const pickDate = (d: Date) => {
    if (picker === "start") setStartDate(d);
    else if (picker === "end") setEndDate(d);
    else if (picker === "cancel") setCancelReminderDate(d);
    setPicker(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RtTopBar />

        <Text style={styles.h1}>Log a new subscription</Text>

        <View style={{ gap: 20 }}>
          {/* Platform selector */}
          <View>
            <Text style={styles.fieldLabel}>Platform</Text>
            <Pressable style={styles.selector} onPress={() => setOpen((v) => !v)}>
              <View style={styles.selectorLeft}>
                <PlatformLogo p={selected} size={28} />
                <Text style={styles.selectorText}>{selected.name}</Text>
              </View>
              <Ionicons name={open ? "chevron-up" : "chevron-down"} size={16} color={wa(0.4)} />
            </Pressable>
            {open && (
              <View style={styles.dropdown}>
                {platforms.map((p, i) => {
                  const active = p.id === selectedId;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        setSelectedId(p.id);
                        setOpen(false);
                      }}
                      style={[
                        styles.dropdownRow,
                        i > 0 && styles.dropdownDivider,
                        active && { backgroundColor: wa(0.05) },
                      ]}
                    >
                      <PlatformLogo p={p} size={28} />
                      <Text style={styles.dropdownText}>{p.name}</Text>
                      {active && <Ionicons name="checkmark" size={16} color={colors.brand} />}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Deal type */}
          <View>
            <Text style={styles.fieldLabel}>Deal type</Text>
            <Segmented>
              <Seg active={dealType === "trial"} onPress={() => setDealType("trial")}>
                Free trial
              </Seg>
              <Seg active={dealType === "promo"} onPress={() => setDealType("promo")}>
                Promo rate
              </Seg>
              <Seg active={dealType === "full"} onPress={() => setDealType("full")}>
                Full price
              </Seg>
            </Segmented>
          </View>

          {/* Dates */}
          {dealType !== "full" && (
            <>
              <View style={styles.dateRow}>
                <DateField
                  label="Start date"
                  value={startDate}
                  active={picker === "start"}
                  onPress={() => setPicker((v) => (v === "start" ? null : "start"))}
                />
                <DateField
                  label="Ends"
                  value={endDate}
                  active={picker === "end"}
                  onPress={() => setPicker((v) => (v === "end" ? null : "end"))}
                />
              </View>
              {picker && (
                <MonthCalendar value={picker === "start" ? startDate : endDate} onSelect={pickDate} />
              )}
            </>
          )}

          {/* Price fields by deal type */}
          {dealType === "trial" && (
            <PriceField
              label="After free trial"
              value={afterTrialCost}
              onChangeText={setAfterTrialCost}
            />
          )}
          {dealType === "promo" && (
            <View style={styles.dateRow}>
              <View style={{ flex: 1 }}>
                <PriceField label="Promo price" value={promoCost} onChangeText={setPromoCost} />
              </View>
              <View style={{ flex: 1 }}>
                <PriceField
                  label="After promotional rate"
                  value={afterPromoCost}
                  onChangeText={setAfterPromoCost}
                />
              </View>
            </View>
          )}
          {dealType === "full" && (
            <>
              <View>
                <Text style={styles.fieldLabel}>Billing cycle</Text>
                <Segmented>
                  <Seg active={fullBillingCycle === "monthly"} onPress={() => setFullBillingCycle("monthly")}>
                    Monthly
                  </Seg>
                  <Seg active={fullBillingCycle === "annual"} onPress={() => setFullBillingCycle("annual")}>
                    Annually
                  </Seg>
                </Segmented>
              </View>

              {fullBillingCycle === "monthly" ? (
                <PriceField label="Monthly cost" value={monthlyCost} onChangeText={setMonthlyCost} />
              ) : (
                <PriceField label="Annual cost" value={annualCost} onChangeText={setAnnualCost} />
              )}

              <View style={styles.notifyCard}>
                <View style={styles.notifyTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.notifyTitle}>Remind me to cancel</Text>
                    <Text style={styles.notifySub}>Set when we should send your reminder.</Text>
                  </View>
                  <Toggle value={notify} onToggle={() => setNotify((v) => !v)} />
                </View>
                {notify && (
                  <DateField
                    label="Reminder date"
                    value={cancelReminderDate}
                    active={picker === "cancel"}
                    onPress={() => setPicker((v) => (v === "cancel" ? null : "cancel"))}
                  />
                )}
              </View>
              {notify && picker === "cancel" && <MonthCalendar value={cancelReminderDate} onSelect={pickDate} />}
            </>
          )}

          {/* Notify card */}
          {dealType !== "full" && (
            <View style={styles.notifyCard}>
              <View style={styles.notifyTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifyTitle}>Remind me before deal ends</Text>
                  <Text style={styles.notifySub}>Avoid surprise charges.</Text>
                </View>
                <Toggle value={notify} onToggle={() => setNotify((v) => !v)} />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.saveBar}>
        <Pressable
          style={({ pressed }) => [styles.saveBtn, pressed && { opacity: 0.8 }]}
          onPress={() => router.navigate("/")}
        >
          <Text style={styles.saveBtnText}>Save subscription</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function DateField({
  label,
  value,
  active,
  onPress,
}: {
  label: string;
  value: Date;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={[styles.dateField, active && styles.dateFieldActive]} onPress={onPress}>
        <Text style={styles.dateValue}>{formatDate(value)}</Text>
        <Ionicons name="calendar-outline" size={14} color={active ? colors.brand : wa(0.4)} />
      </Pressable>
    </View>
  );
}

function PriceField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.costField}>
        <View style={styles.costInputWrap}>
          <Text style={styles.costPrefix}>£</Text>
          <TextInput
            value={value}
            onChangeText={(text) => onChangeText(maskPriceInput(text))}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={wa(0.35)}
            style={styles.costInput}
            maxLength={12}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    </View>
  );
}

/* Pure-JS month calendar — mirrors the web concept's date popover, runs the
 * same on iOS, Android and web (no native date-picker dependency). */
function MonthCalendar({ value, onSelect }: { value: Date; onSelect: (d: Date) => void }) {
  const [view, setView] = useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const year = view.getFullYear();
  const month = view.getMonth();
  const startDow = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const shift = (delta: number) => setView(new Date(year, month + delta, 1));

  return (
    <View style={styles.calendar}>
      <View style={styles.calHeader}>
        <Pressable onPress={() => shift(-1)} hitSlop={8} style={styles.calNav}>
          <Ionicons name="chevron-back" size={18} color={colors.white} />
        </Pressable>
        <Text style={styles.calTitle}>
          {MONTHS[month]} {year}
        </Text>
        <Pressable onPress={() => shift(1)} hitSlop={8} style={styles.calNav}>
          <Ionicons name="chevron-forward" size={18} color={colors.white} />
        </Pressable>
      </View>
      <View style={styles.calGrid}>
        {WEEKDAYS.map((w) => (
          <View key={w} style={styles.calCell}>
            <Text style={styles.calWeekday}>{w}</Text>
          </View>
        ))}
        {cells.map((d, i) => {
          const isSel = d != null && sameDay(new Date(year, month, d), value);
          return (
            <Pressable
              key={i}
              style={styles.calCell}
              disabled={d == null}
              onPress={() => d != null && onSelect(new Date(year, month, d))}
            >
              {d != null && (
                <View style={[styles.calDay, isSel && styles.calDaySel]}>
                  <Text style={[styles.calDayText, isSel && styles.calDayTextSel]}>{d}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Segmented({ children, bg = colors.card }: { children: React.ReactNode; bg?: string }) {
  return (
    <View style={[styles.segmented, { backgroundColor: bg, borderWidth: bg === colors.card ? 1 : 0 }]}>
      {children}
    </View>
  );
}

function Seg({
  children,
  active,
  onPress,
}: {
  children: React.ReactNode;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable style={[styles.seg, active && { backgroundColor: colors.brand }]} onPress={onPress}>
      <Text style={[styles.segText, { color: active ? colors.black : wa(0.6) }]}>{children}</Text>
    </Pressable>
  );
}

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.toggle, { backgroundColor: value ? colors.brand : wa(0.15) }]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={[styles.knob, value ? { right: 4 } : { left: 4 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 48 },

  h1: { color: colors.white, fontSize: 24, fontWeight: "700", letterSpacing: -0.5, marginBottom: 28 },

  fieldLabel: { color: wa(0.5), fontSize: 12, fontWeight: "500", paddingHorizontal: 4, marginBottom: 8 },

  selector: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    paddingHorizontal: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectorLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  selectorText: { color: colors.white, fontSize: 14, fontWeight: "500" },

  dropdown: {
    marginTop: 8,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    overflow: "hidden",
  },
  dropdownRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  dropdownDivider: { borderTopWidth: 1, borderTopColor: wa(0.05) },
  dropdownText: { color: colors.white, fontSize: 14, fontWeight: "500", flex: 1 },

  dateRow: { flexDirection: "row", gap: 12 },
  dateField: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    paddingHorizontal: 16,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateFieldActive: { borderColor: wa(0.3) },
  dateValue: { color: colors.white, fontSize: 14, fontVariant: ["tabular-nums"] },

  calendar: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    padding: 12,
  },
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  calNav: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  calTitle: { color: colors.white, fontSize: 14, fontWeight: "600" },
  calGrid: { flexDirection: "row", flexWrap: "wrap" },
  calCell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: "center", justifyContent: "center" },
  calWeekday: { color: wa(0.35), fontSize: 11, fontWeight: "600" },
  calDay: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  calDaySel: { backgroundColor: colors.brand },
  calDayText: { color: wa(0.85), fontSize: 13 },
  calDayTextSel: { color: colors.black, fontWeight: "700" },

  segmented: { flexDirection: "row", padding: 4, borderRadius: radius.xl, borderColor: wa(0.05) },
  seg: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  segText: { fontSize: 12, fontWeight: "600" },

  costField: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    paddingHorizontal: 16,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  costInputWrap: { flexDirection: "row", alignItems: "center", gap: 2 },
  costPrefix: { color: colors.white, fontSize: 14, fontVariant: ["tabular-nums"] },
  costInput: {
    color: colors.white,
    fontSize: 14,
    fontVariant: ["tabular-nums"],
    minWidth: 72,
    paddingVertical: 0,
    borderWidth: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
  },

  notifyCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: wa(0.05),
    gap: 20,
  },
  notifyTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  notifyTitle: { color: colors.white, fontSize: 14, fontWeight: "700" },
  notifySub: { color: wa(0.4), fontSize: 11, marginTop: 2 },

  toggle: { width: 44, height: 28, borderRadius: radius.full, justifyContent: "center" },
  knob: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: colors.black },

  saveBar: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.bg,
  },
  saveBtn: {
    backgroundColor: colors.brand,
    borderRadius: radius.xl,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { color: colors.black, fontSize: 15, fontWeight: "700" },
});
