import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetNotes } from "./getNotes";

export async function DeleteNote(noteId: string) {
  try {
    const notes = await GetNotes();
    
    await AsyncStorage.removeItem(`note-${noteId}`);
    
    const newNotes = notes.filter(note => note.id !== noteId);
    
    await AsyncStorage.setItem('notes-list', JSON.stringify(newNotes));
    
    return { success: true, data: null };
  } catch (error) {
    console.error("Erro ao deletar nota:", error);
    return { success: false, data: "Erro ao deletar a nota" };
  }
}