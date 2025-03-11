import AsynncStoreage from "@react-native-async-storage/async-storage"
import { Note, NotesList } from "../types/note"

enum Filter {
  'A-Z' = 'A-Z',
  'Z-A' = 'Z-A',
  'Oldest' = 'Oldest',
  'Younger' = 'Younger'
}

export async function GetNotesList() {
  try {
    const notesListString = await AsynncStoreage.getItem('notes-list')
    if (!notesListString) return []

    const notesList = JSON.parse(notesListString) as NotesList[]
    return notesList
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function GetNotes(orderBy?: Filter) {
  try {
    const notesList = await GetNotesList()

    const notes: Note[] = (await Promise.all(notesList.map(async ({ noteId }) => {
      const note = await AsynncStoreage.getItem(`note-${noteId}`)
      if (note)
        return JSON.parse(note) as Note
    }))).filter((note): note is Note => note !== undefined)

    switch (orderBy) {
      case Filter['A-Z']:
        return notes.sort((a, b) => a.title.localeCompare(b.title))
      
      case Filter['Z-A']:
        return notes.sort((a, b) => b.title.localeCompare(a.title))

      case Filter.Oldest:
        return notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
      case Filter.Younger:
      case undefined:
      default:
        return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } 
  } catch (error) {
    console.error(error)
    return []
  }
}