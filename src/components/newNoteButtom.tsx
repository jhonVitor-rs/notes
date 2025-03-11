import {
  SaveNote,
  AddNoteInList,
  GenerateNewNote,
} from "@/utils/storage/addNote";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export function NewNoteButtom() {
  const createNote = async () => {
    const newNote = GenerateNewNote(null);
    const { success, data } = await SaveNote(newNote);
    if (!success) {
      alert(data);
    } else {
      await AddNoteInList(data);
      router.push(`/notes/${data}`);
    }
  };

  return (
    <Button style={styles.button} onPress={() => createNote()}>
      <AntDesign name="addfile" size={24} style={styles.icon} />
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    height: 70,
    width: 70,
    borderRadius: 70,
    position: "absolute",
    bottom: 180,
    right: 20,
  },
  icon: {
    color: "#0891b2",
  },
});
