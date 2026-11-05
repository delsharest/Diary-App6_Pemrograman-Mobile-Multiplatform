import { useCallback, useRef, useState, type ComponentRef } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useDiary } from "../../src/context/DiaryContext";
import { useDiarySearch } from "../../src/hooks/useDiarySearch";
import DiaryCard from "../../src/components/DiaryCard";
import { MOODS } from "../../src/styles/moods";
import { COLORS, SPACE, TYPO } from "../../src/styles/tokens";

export default function HomeScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();
  const [mood, setMood] = useState("");
  const { query, setQuery, resetSearch, filteredEntries, resultCount } = useDiarySearch(entries, mood);
  const searchRef = useRef<ComponentRef<typeof TextInput>>(null);
  const openDetail = useCallback((id: number) => {
    router.push({ pathname: "/detail/[id]", params: { id: String(id) } });
  }, [router]);
  const clearSearch = useCallback(() => {
    resetSearch();
    searchRef.current?.focus();
  }, [resetSearch]);
  const resetFilter = useCallback(() => {
    resetSearch();
    setMood("");
    searchRef.current?.focus();
  }, [resetSearch]);

  return (
    <View style={styles.container}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={filteredEntries}
        extraData={likedIds}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<View style={styles.headerContent}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>RUANG CERITA KECILMU</Text>
            <Text style={styles.header}>Buku Harian</Text>
            <Text style={styles.subtitle}>Simpan cerita, kenali perasaanmu.</Text>
            <Text style={styles.stat}>{entries.length} cerita  ·  {likedIds.size} disukai</Text>
          </View>
          <View style={styles.searchRow}>
            <TextInput ref={searchRef} value={query} onChangeText={setQuery}
              placeholder="Cari judul, cerita, atau tanggal..." placeholderTextColor={COLORS.muted}
              accessibilityLabel="Cari diary" style={styles.search} />
            <Pressable accessibilityRole="button" onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>Bagaimana suasana hatimu?</Text>
          <View style={styles.moods}>
            {[{ emoji: "", label: "Semua" }, ...MOODS].map((item) => (
              <Pressable key={item.label} onPress={() => setMood(item.emoji)}
                accessibilityRole="button" accessibilityState={{ selected: mood === item.emoji }}
                style={[styles.chip, mood === item.emoji && styles.chipSelected]}>
                <Text style={[styles.chipText, mood === item.emoji && styles.selectedText]}>{item.emoji} {item.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.resultRow}>
            <Text style={styles.counter}>{resultCount} entri ditemukan</Text>
            <Pressable accessibilityRole="button" onPress={resetFilter} style={styles.reset}>
              <Text style={styles.clearText}>Reset Filter</Text>
            </Pressable>
          </View>
        </View>}
        renderItem={({ item }) => <DiaryCard {...item} liked={likedIds.has(item.id)}
          onPress={() => openDetail(item.id)} onToggleLike={() => toggleLike(item.id)} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.label}>Belum ada cerita yang cocok</Text>
          <Text style={styles.counter}>Coba kata lain atau tekan Reset Filter.</Text></View>}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACE.l, gap: SPACE.m, paddingBottom: 32 },
  headerContent: { gap: 14 },
  hero: { backgroundColor: COLORS.soft, borderRadius: 22, padding: 22, gap: 8 },
  eyebrow: { fontSize: 10, fontWeight: "700", letterSpacing: 2, color: COLORS.accent },
  header: { fontSize: TYPO.h1, fontWeight: "800", color: COLORS.text },
  subtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 21 },
  stat: { color: COLORS.accent, fontWeight: "600", marginTop: 6 },
  searchRow: { flexDirection: "row", gap: 8 },
  search: { flex: 1, minHeight: 48, padding: 12, backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, color: COLORS.text },
  clearButton: { justifyContent: "center", paddingHorizontal: 14, borderRadius: 14, backgroundColor: COLORS.soft },
  clearText: { color: COLORS.accent, fontWeight: "700", fontSize: 13 },
  label: { color: COLORS.text, fontSize: 15, fontWeight: "700" },
  moods: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 24, paddingHorizontal: 12, minHeight: 44, justifyContent: "center" },
  chipSelected: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  chipText: { color: COLORS.text, fontSize: 13 }, selectedText: { color: "#fff" },
  resultRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" },
  counter: { color: COLORS.muted, fontSize: 13, lineHeight: 22 },
  reset: { minHeight: 44, justifyContent: "center", paddingHorizontal: 4 },
  empty: { padding: 24, alignItems: "center", gap: 8, backgroundColor: COLORS.surface, borderRadius: 18 },
});
