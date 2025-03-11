import React from "react";
import { Button, Drawer } from "react-native-paper";
import { useNotes } from "@/providers/notesProvider";
import { FlatList, StyleSheet, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  AddNoteInList,
  GenerateNewNote,
  SaveNote,
} from "@/utils/storage/addNote";
import { router } from "expo-router";
import { GetNote } from "@/utils/storage/getNote";
import { Note } from "@/utils/types/note";

export function NotesDrawer() {
  const [active, setActive] = React.useState("");
  const { notes, setNote, fetchNotes } = useNotes();

  const createNote = async () => {
    const newNote = GenerateNewNote(null);
    const { success, data } = await SaveNote(newNote);
    if (!success) {
      alert(data);
    } else {
      await AddNoteInList(data);
      fetchNotes();
      router.push(`/(notes)/${data}`);
    }
  };

  const onRedirect = async (noteId: string) => {
    const { success, data } = await GetNote(noteId);
    if (success) {
      const note = data as Note;
      setNote(note);
      setActive(note.id);
      router.push(`/(notes)/${note.id}`);
    } else {
      alert("Note not found");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={notes}
        keyExtractor={(note) => note.id}
        numColumns={1}
        renderItem={({ item }) => (
          <Drawer.Item
            style={styles.drawerItem}
            label={item.title}
            onPress={() => onRedirect(item.id)}
            theme={{ colors: { onSurfaceVariant: "#e2e8f0" } }}
          />
        )}
      />
      <Drawer.Section style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => createNote()}
        >
          <AntDesign name="addfile" size={21} style={styles.icon} />
        </Button>
      </Drawer.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#334155",
    borderRadius: 0,
  },
  list: {
    flex: 1,
    margin: 4,
    marginTop: 8,
    color: "#fff",
  },
  drawerItem: {
    backgroundColor: "transparent",
    borderRadius: 10,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
    height: 150,
    paddingEnd: 12,
  },
  button: {
    backgroundColor: "#0f172a",
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#0891b2",
  },
});
