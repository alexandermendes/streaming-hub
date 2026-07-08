import { Ionicons } from "@expo/vector-icons";
import {
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold_Italic,
  Fraunces_700Bold_Italic,
  useFonts,
} from "@expo-google-fonts/fraunces";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import type { ColorValue } from "react-native";

import "../global.css";
import { colors, wa } from "@/theme";

SplashScreen.preventAutoHideAsync();

type IoniconName = keyof typeof Ionicons.glyphMap;
const tabIcon =
  (outline: IoniconName, solid: IoniconName) =>
  ({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) => (
    <Ionicons name={focused ? solid : outline} size={size} color={color} />
  );

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Fraunces_500Medium_Italic,
    Fraunces_600SemiBold_Italic,
    Fraunces_700Bold_Italic,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.bg },
          tabBarActiveTintColor: colors.brand,
          tabBarInactiveTintColor: wa(0.4),
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600", lineHeight: 14 },
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: wa(0.06),
            paddingBottom: 8,
            paddingTop: 2,
            minHeight: 64,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: "Home", tabBarIcon: tabIcon("home-outline", "home") }}
        />
        <Tabs.Screen
          name="watchlist"
          options={{ title: "Watchlist", tabBarIcon: tabIcon("bookmark-outline", "bookmark") }}
        />
        <Tabs.Screen
          name="news"
          options={{ title: "Highlights", tabBarIcon: tabIcon("newspaper-outline", "newspaper") }}
        />
        <Tabs.Screen
          name="add"
          options={{ title: "Add", tabBarIcon: tabIcon("add-circle-outline", "add-circle") }}
        />
        {/* Deal detail — reachable via router.push, hidden from the tab bar. */}
        <Tabs.Screen name="deal" options={{ href: null }} />
      </Tabs>
    </>
  );
}
