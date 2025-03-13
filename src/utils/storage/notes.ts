import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note, NotesList } from "../types/note";
import { GenId } from "./genId";

export enum SortFilter {
  'A_Z' = 'A-Z',
  'Z_A' = 'Z-A',
  'OLDEST' = 'Oldest',
  'NEWEST' = 'Newest'
}

type ServiceResponse<T> = {
  success: boolean;
  data: T | null
}

export class NotesService {
  private static NOTE_PREFIX = 'note-';
  private static NOTES_LIST_KEY = 'notes-list';
  private static LAST_NOTE_KEY = 'last-note';

  static generateNewBlankNote(title: string): Note {
    return {
      id: GenId(),
      title,
      content: '',
      createdAt: new Date()
    }
  }

  static async getNotesList(): Promise<NotesList[]> {
    try {
      const notesListString = await AsyncStorage.getItem(this.NOTES_LIST_KEY)
      if (!notesListString) return []

      return JSON.parse(notesListString) as NotesList[]
    } catch (error) {
      console.error('Error retrieving notes list:', error);
      return [];
    }
  }

  static async getNote(noteId: string): Promise<ServiceResponse<Note>> {
    try {
      const noteString = await AsyncStorage.getItem(`${this.NOTE_PREFIX}${noteId}`)
      if (!noteString) throw new Error("Note not found")

      const note: Note = JSON.parse(noteString)
      return {
        success: true,
        data: note
      }
    } catch (error) {
      console.error('Error getting note:', error);
      return {
        success: false,
        data: null
      };
    }
  }

  static async getNotes(orderBy?: SortFilter): Promise<Note[]> {
    try {
      const notesList = await this.getNotesList()

      const notes: Note[] = (await Promise.all(notesList.map(async ({ noteId }) => {
        const note = await AsyncStorage.getItem(`${this.NOTE_PREFIX}${noteId}`)
        if (note) return JSON.parse(note) as Note
        return undefined
      }))).filter((note): note is Note => note !== undefined)

      switch (orderBy) {
        case SortFilter.A_Z:
          return notes.sort((a, b) => a.title.localeCompare(b.title));
        
        case SortFilter.Z_A:
          return notes.sort((a, b) => b.title.localeCompare(a.title));

        case SortFilter.OLDEST:
          return notes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            
        case SortFilter.NEWEST:
        default:
          return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  }

  static async getLastNote(): Promise<Note | null> {
    try {
      const lastNoteId = await AsyncStorage.getItem(this.LAST_NOTE_KEY);
      if (!lastNoteId) return null;

      const noteKey = `${this.NOTE_PREFIX}${JSON.parse(lastNoteId)}`;
      const noteString = await AsyncStorage.getItem(noteKey);
      if (!noteString) return null;

      return JSON.parse(noteString) as Note;
    } catch (error) {
      console.error('Error getting last note:', error);
      return null;
    }
  }

  static async saveNote(note: Note): Promise<ServiceResponse<string>> {
    try {
      await AsyncStorage.setItem(`${this.NOTE_PREFIX}${note.id}`, JSON.stringify(note));
    
      return {
        success: true,
        data: note.id
      };
    } catch (error) {
      console.error('Error saving note:', error);
      return {
        success: false,
        data: "Error adding note."
      };
    }
  }

  static async addNoteToList(noteId: string): Promise<boolean> {
    try {
      const notesList = await this.getNotesList()
      const newNote: NotesList = { noteId }
      const updatedNotesList = [...notesList, newNote]

      await AsyncStorage.setItem(this.NOTES_LIST_KEY, JSON.stringify(updatedNotesList))
      return true;
    } catch (error) {
      console.error('Error adding note to list:', error);
      return false;
    }
  }

  static async setLastNote(noteId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.LAST_NOTE_KEY, JSON.stringify(noteId));
    } catch (error) {
      console.error('Error setting last note:', error);
    }
  }

  static async deleteNote(noteId: string): Promise<boolean> {
    try {
      // Remove a nota
      await AsyncStorage.removeItem(`${this.NOTE_PREFIX}${noteId}`);
      
      // Atualiza a lista removendo a nota excluída
      const notesList = await this.getNotesList();
      const updatedNotesList = notesList.filter(note => note.noteId !== noteId);
      
      await AsyncStorage.setItem(this.NOTES_LIST_KEY, JSON.stringify(updatedNotesList));
      
      return true
    } catch (error) {
      console.error('Error deleting note:', error);
      return false
    }
  }

  static async createAndSaveNote(title: string): Promise<ServiceResponse<Note>> {
    try {
      const newNote = this.generateNewBlankNote(title)
      const saveResult = await this.saveNote(newNote)

      if (saveResult.success && typeof saveResult.data === 'string') {
        const addedToList = await this.addNoteToList(saveResult.data)

        if (addedToList) {
          return {
            success: true,
            data: newNote
          }
        }
      }

      throw new Error("Failed to create and save note");
    } catch (error) {
      console.error('Error creating and saving note:', error);
      return {
        success: false,
        data: null
      }; 
    }
  }
}