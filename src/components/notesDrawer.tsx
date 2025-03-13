import React, { useEffect } from "react";
import { Button, Drawer } from "react-native-paper";
import { useNotes } from "@/providers/notesProvider";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  AddNoteInList,
  GenerateNewNote,
  SaveNote,
} from "@/utils/storage/addNote";
import { router } from "expo-router";
import { GetNote } from "@/utils/storage/getNote";
import { Note } from "@/utils/types/note";
import { SetLastNote } from "@/utils/storage/setLastNote";
import { DeleteNote } from "@/utils/storage/deleteNotes";
import { NotesService } from "@/utils/storage/notes";

export function NotesDrawer() {
  const [active, setActive] = React.useState("");
  const { notes, setNote, createNote, deleteNote } = useNotes();

  useEffect(() => {
    const redirectToLastNote = async () => {
      const lastNote = await NotesService.getLastNote();
      if (lastNote) {
        setNote(lastNote);
        setActive(lastNote.id);
        router.push(`/(notes)/${lastNote.id}`);
      }
    };
    redirectToLastNote();
  }, []);

  const onRedirect = async (noteId: string) => {
    const { success, data } = await NotesService.getNote(noteId);
    if (success && data) {
      setNote(data);
      setActive(data.id);
      router.push(`/(notes)/${data.id}`);
    } else {
      alert("Note not found");
    }
  };

  const handleDelete = async (noteId: string) => {
    Alert.alert("Excluir nota", "Tem certeza que deseja excluir esta nota?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: async () => deleteNote(noteId),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        data={notes}
        keyExtractor={(item) => item.id}
        numColumns={1}
        renderItem={({ item }) => (
          <View style={styles.drawerItemContainer}>
            <TouchableOpacity
              style={styles.noteItem}
              onPress={() => onRedirect(item.id)}
            >
              <Text style={styles.noteText}>{item.title || "Sem título"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonTrash}
              onPress={() => handleDelete(item.id)}
            >
              <Feather name="trash-2" size={16} style={styles.icon} />
            </TouchableOpacity>
          </View>
        )}
      />
      <Drawer.Section style={styles.buttonContainer}>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => createNote(`New-note${notes.length}`)}
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
  drawerItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  noteItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  noteText: {
    color: "#e2e8f0",
    fontSize: 14,
  },
  buttonTrash: {
    backgroundColor: "#0f172a",
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
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
