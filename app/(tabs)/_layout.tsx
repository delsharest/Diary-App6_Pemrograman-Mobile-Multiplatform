import { Tabs } from "expo-router";
import { Text, type ColorValue } from "react-native";
import { COLORS } from "../../src/styles/tokens";
const icon = (symbol: string, color: ColorValue | undefined) => <Text style={{ fontSize: 22, color }}>{symbol}</Text>;
export default function TabsLayout() {
  return <Tabs screenOptions={{
    tabBarActiveTintColor: COLORS.accent, tabBarInactiveTintColor: COLORS.muted,
    headerTintColor: COLORS.text, headerStyle: { backgroundColor: COLORS.surface },
    tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
    tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
  }}>
    <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => icon("⌂", color) }} />
    <Tabs.Screen name="favorites" options={{ title: "Favorites", tabBarIcon: ({ color }) => icon("♡", color) }} />
    <Tabs.Screen name="create" options={{ title: "Tambah", tabBarIcon: ({ color }) => icon("＋", color) }} />
    <Tabs.Screen name="settings" options={{ title: "Pengaturan", tabBarIcon: ({ color }) => icon("⚙", color) }} />
    <Tabs.Screen name="two" options={{ href: null }} />
  </Tabs>;
}
