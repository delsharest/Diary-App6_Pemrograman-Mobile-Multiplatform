import { useState } from "react";

import { StyleSheet, Switch, Text, View } from "react-native";

import { COLORS } from "../../src/styles/tokens";

export default function SettingsScreen() {
  const [compactMode, setCompactMode] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pengaturan</Text>

      <View style={styles.row}>
        <Text>Compact Mode</Text>

        <Switch value={compactMode} onValueChange={setCompactMode} />
      </View>

      <Text style={styles.info}>
        State: {compactMode ? "Aktif" : "Nonaktif"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
  },
  row: {
    padding: 20,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: {
    marginTop: 12,
    color: COLORS.muted,
  },
});
