import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "../types/note";

export async function SetLastNote(noteId: string) {
  try {
    await AsyncStorage.setItem("last-note", JSON.stringify(noteId))
  } catch (error) {
    console.error(error)
  }
}

export async function GetLastNote() {
  try {
    const lastNoteId = await AsyncStorage.getItem("last-note")
    if (!lastNoteId) return null

    const noteKey = `note-${JSON.parse(lastNoteId)}`
    const noteString = await AsyncStorage.getItem(noteKey)
    if (!noteString) return null

    const note = JSON.parse(noteString) as Note

    return note
  } catch (error) {
    console.error(error)
    return null
  }
}