import { Note, NotesList } from "../types/note";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetNotesList } from './getNotes';
import { GenId } from "./genId";

export function GenerateNewNote(fatherId: string | null): Note {
  return {
    id: GenId(),
    title: `New-Note`,
    content: '',
    fatherId,
    chidrens: [],
    createdAt: new Date()
  }
}

export async function SaveNote(note: Note) {
  try {
    await AsyncStorage.setItem(`note-${note.id}`, JSON.stringify(note))
  
    return {
      success: true,
      data: note.id
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      data: "Error adding note."
    }
  }
}

export async function AddNoteInList(noteId: string) {
  try {
    const notesList = await GetNotesList()

    const newNote: NotesList = { noteId }

    const updateNoteList = [...notesList, newNote]

    await AsyncStorage.setItem('notes-list', JSON.stringify(updateNoteList))

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}