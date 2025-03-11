import { Note } from "@/utils/types/note";
import { Button, Card, Checkbox, Text } from "react-native-paper";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";

interface props {
  note: Note;
  selectionMode: boolean;
  addNoteToSelectionList: (noteId: string) => void;
  removeNoteFromSelectionList: (noteId: string) => void;
}

export function NoteCard({
  note,
  selectionMode,
  addNoteToSelectionList,
  removeNoteFromSelectionList,
}: props) {
  const [_isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (!selectionMode) setIsSelected(false);
  }, [selectionMode]);

  const navigateToNote = () => {
    if (!selectionMode) router.push(`/notes/${note.id}`);
  };

  const toogleSelection = () => {
    const newSelectionState = !isSelected;
    setIsSelected(newSelectionState);

    if (newSelectionState) addNoteToSelectionList(note.id);
    else removeNoteFromSelectionList(note.id);
  };

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const handlePressCard = () => {
    if (selectionMode) {
      toogleSelection();
    } else {
      navigateToNote();
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ scale: scaleAnim }] }]}
    >
      {selectionMode && (
        <Pressable style={styles.checkboxContainer} onPress={toogleSelection}>
          <Checkbox
            status={isSelected ? "checked" : "unchecked"}
            color="#60a5fa"
          />
        </Pressable>
      )}
      <Button
        style={[styles.noteButton, isSelected && styles.noteButtonPressed]}
        onPress={handlePressCard}
        onLongPress={toogleSelection}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.buttonContent}>
          <Text style={styles.title}>{note.title || "Título da nota"}</Text>
          <Card style={styles.card}>
            <Card.Content>
              <WebView
                style={styles.content}
                originWhitelist={["*"]}
                source={{ html: note.content }}
              />
            </Card.Content>
          </Card>
        </View>
      </Button>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    position: "relative",
    width: "100%",
    maxWidth: 160,
    maxHeight: 200,
  },
  checkboxContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    borderRadius: 12,
  },
  noteButton: {
    width: "100%",
    height: "100%",
    padding: 0,
    margin: 0,
  },
  noteButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonContent: {
    width: "100%",
    padding: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
  },
  card: {
    width: "100%",
    height: "80%",
    borderRadius: 5,
    backgroundColor: "#0f172a",
    marginTop: 4,
  },
  content: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 20,
  },
});
