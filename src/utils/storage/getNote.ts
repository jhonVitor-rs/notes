import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

export async function GetNote(noteId: string) {
  try {
    const noteString = await AsyncStorage.getItem(`note-${noteId}`)
    if (!noteString) throw new Error("Note not found")

    const note: Note = JSON.parse(noteString)
    return {
      success: true,
      data: note
    }
  } catch (error) {
    console.error(error)

    return {
      success: false,
      data: 'Failed to search for note'
    }
  }
}