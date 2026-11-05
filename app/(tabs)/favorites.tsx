import { useCallback } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useDiary } from "../../src/context/DiaryContext";
import { useLikedEntries } from "../../src/hooks/useLikedEntries";
import DiaryCard from "../../src/components/DiaryCard";
import { COLORS } from "../../src/styles/tokens";

export default function FavoritesScreen() {
  const router = useRouter();
  const { entries, likedIds, toggleLike } = useDiary();
  const favorites = useLikedEntries(entries, likedIds);
  const openDetail = useCallback((id: number) => {
    router.push({ pathname: "/detail/[id]", params: { id: String(id) } });
  }, [router]);
  return <View style={styles.container}>
    <FlatList data={favorites} extraData={likedIds} keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      ListHeaderComponent={<View style={styles.hero}>
        <Text style={styles.title}>Cerita favoritmu ♥</Text>
        <Text style={styles.subtitle}>{favorites.length} cerita yang ingin kamu kenang kembali.</Text>
      </View>}
      renderItem={({ item }) => <DiaryCard {...item} liked={likedIds.has(item.id)}
        onPress={() => openDetail(item.id)} onToggleLike={() => toggleLike(item.id)} />}
      ListEmptyComponent={<View style={styles.empty}>
        <Text style={styles.heart}>♡</Text><Text style={styles.label}>Belum ada favorit</Text>
        <Text style={styles.subtitle}>Tekan hati pada Home atau Detail untuk menambahkan cerita di sini.</Text>
      </View>} />
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, gap: 12, paddingBottom: 32 },
  hero: { padding: 22, gap: 10, backgroundColor: COLORS.soft, borderRadius: 22, marginBottom: 4 },
  title: { fontSize: 25, fontWeight: "800", color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.muted, lineHeight: 22 },
  empty: { padding: 28, gap: 12, backgroundColor: COLORS.surface, borderRadius: 18 },
  heart: { fontSize: 48, color: COLORS.danger },
  label: { color: COLORS.text, fontWeight: "700", fontSize: 18 },
});
