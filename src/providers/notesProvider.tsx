import { GetNotes } from "@/utils/storage/getNotes";
import { NotesService, SortFilter } from "@/utils/storage/notes";
import { GetLastNote } from "@/utils/storage/setLastNote";
import { Note } from "@/utils/types/note";
import { useFocusEffect } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface NotesContextType {
  notes: Note[];
  note: Note | null;
  setNote: (note: Note) => void;
  fetchNotes: (orderBy?: SortFilter) => Promise<void>;
  createNote: (title: string) => Promise<Note | null>;
  deleteNote: (noteId: string) => Promise<boolean>;
  updateNote: (note: Note) => Promise<boolean>;
}

const NotesContext = createContext<NotesContextType>({} as NotesContextType);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);

  const fetchNotes = async (orderBy?: SortFilter) => {
    try {
      const fetchedNotes = await NotesService.getNotes(orderBy);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const setSelectedNote = useCallback((selectedNote: Note) => {
    setNote(selectedNote);
    NotesService.setLastNote(selectedNote.id).catch((error) => {
      console.error("Error setting last note:", error);
    });
  }, []);

  const createNote = async (title: string): Promise<Note | null> => {
    try {
      const result = await NotesService.createAndSaveNote(title);
      if (result.success && result.data) {
        await fetchNotes();
        return result.data as Note;
      }
      return null;
    } catch (error) {
      console.error("Error creating note:", error);
      return null;
    }
  };

  const deleteNote = async (noteId: string): Promise<boolean> => {
    try {
      const result = await NotesService.deleteNote(noteId);
      if (result) {
        if (note && note.id === noteId) {
          setNote(null);
        }

        await fetchNotes();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  };

  const updateNote = async (updatedNote: Note): Promise<boolean> => {
    try {
      const result = await NotesService.saveNote(updatedNote);
      if (result.success) {
        if (note && note.id === updatedNote.id) {
          setNote(updatedNote);
        }

        await fetchNotes();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating note:", error);
      return false;
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  useEffect(() => {
    const loadLastNote = async () => {
      const lastNote = await GetLastNote();
      if (lastNote) {
        setNote(lastNote);
      }
    };
    loadLastNote();
  }, []);

  const contextValue: NotesContextType = {
    notes,
    note,
    setNote: setSelectedNote,
    fetchNotes,
    createNote,
    deleteNote,
    updateNote,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used within a NotesProvider");
  }

  return context;
}
