import { GetNotes } from "@/utils/storage/getNotes";
import { Note } from "@/utils/types/note";
import { useFocusEffect } from "expo-router";
import { createContext, useCallback, useContext, useState } from "react";
import { BackHandler } from "react-native";

interface NotesContextType {
  notes: Note[];
  note: Note;
  setNote: (note: Note) => void;
  selectedNotes: string[];
  selectionMode: boolean;
  fetchNotes: () => Promise<void>;
  addNoteToSelectionList: (noteId: string) => void;
  removeNoteFromSelectionList: (noteId: string) => void;
  exitSelectionMode: () => void;
  deleteSelectedNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType>({} as NotesContextType);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note>({} as Note);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await GetNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    }
  };

  const setSelectedNote = (note: Note) => {
    setNote(note);
  };

  const addNoteToSelectionList = (noteId: string) => {
    setSelectionMode(true);
    setSelectedNotes((prev) => {
      if (!prev.includes(noteId)) {
        return [...prev, noteId];
      }
      return prev;
    });
  };

  const removeNoteFromSelectionList = (noteId: string) => {
    setSelectedNotes((notes) => {
      const filtered = notes.filter((id) => id !== noteId);
      if (filtered.length === 0) {
        setSelectionMode(false);
      }
      return filtered;
    });
  };

  const exitSelectionMode = () => {
    setSelectedNotes([]);
    setSelectionMode(false);
  };

  const deleteSelectedNotes = async () => {
    console.log("Notas para deletar:", selectedNotes);
    // Implementar a lógica para deletar as notas
    // ...

    await fetchNotes();
    exitSelectionMode();
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (selectionMode) {
          exitSelectionMode();
          return true;
        }
        return false;
      };
      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [selectionMode])
  );

  const contextValue: NotesContextType = {
    notes,
    note,
    setNote: setSelectedNote,
    selectedNotes,
    selectionMode,
    fetchNotes,
    addNoteToSelectionList,
    removeNoteFromSelectionList,
    exitSelectionMode,
    deleteSelectedNotes,
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
