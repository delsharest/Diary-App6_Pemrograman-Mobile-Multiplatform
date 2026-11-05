import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useDiary } from "../../src/context/DiaryContext";
import { COLORS, RADIUS, SPACE } from "../../src/styles/tokens";

import { MOODS } from "../../src/styles/moods";

export default function CreateScreen() {
  const router = useRouter();
  const { addEntry } = useDiary();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; });
  const [body, setBody] = useState("");
  const [mood, setMood] = useState("😊");

  const canSave = title.trim().length > 0 && body.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    addEntry({
      title: title.trim(),
      date: date.trim(),
      preview: body.trim().slice(0, 80),
      body: body.trim(),
      mood,
    });
    setTitle("");
    setBody("");
    setMood("😊");
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Tambah Diary</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Judul"
        style={styles.input}
      />

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
        style={styles.input}
      />

      <TextInput
        value={body}
        onChangeText={setBody}
        placeholder="Ceritakan harimu..."
        multiline
        style={[styles.input, styles.bodyInput]}
      />

      <Text style={styles.label}>Mood</Text>

      <View style={styles.moodRow}>
        {MOODS.map((item) => (
          <Pressable
            key={item.emoji}
            onPress={() => setMood(item.emoji)}
            style={[styles.moodButton, mood === item.emoji && styles.moodSelected]}
          >
            <Text style={styles.moodEmoji}>{item.emoji}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={save}
        disabled={!canSave}
        style={[styles.saveButton, !canSave && styles.disabled]}
      >
        <Text style={styles.saveText}>Simpan</Text>
      </Pressable>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACE.l,
    gap: SPACE.m,
    backgroundColor: COLORS.background,
  },
  heading: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: 12,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  bodyInput: {
    minHeight: 180,
    lineHeight: 24,
    textAlignVertical: "top",
  },
  label: {
    fontWeight: "700",
  },
  moodRow: {
    flexDirection: "row",
    gap: SPACE.s,
  },
  moodButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
  },
  moodSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.soft,
    borderWidth: 2,
  },
  moodEmoji: {
    fontSize: 26,
  },
  saveButton: {
    padding: 14,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.card,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.45,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
});
