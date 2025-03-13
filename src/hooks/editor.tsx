import { editorTheme } from "@/components/editor/theme";
import { useNotes } from "@/providers/notesProvider";
import { NotesService } from "@/utils/storage/notes";
import { Note } from "@/utils/types/note";
import {
  CoreBridge,
  darkEditorTheme,
  TenTapStartKit,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";
import { useFocusEffect } from "expo-router";
import { MutableRefObject, useCallback, useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

type props = {
  noteId: string;
  appState: MutableRefObject<AppStateStatus>;
};

export function EditorHooks({ noteId, appState }: props) {
  const { fetchNotes } = useNotes();

  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [lastSavedTitle, setLastSavedTitle] = useState("");
  const [lastSavedContent, setLastSavedContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: note?.content || "",
    theme: darkEditorTheme,
    bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(editorTheme)],
  });

  const content = useEditorContent(editor, {
    type: "html",
    debounceInterval: 500,
  }) as string;

  const loadNote = useCallback(async () => {
    if (!noteId) return;

    setIsLoading(true);
    try {
      const result = await NotesService.getNote(noteId);
      if (result.success && result.data) {
        setNote(result.data);
        setTitle(result.data.title);
        setLastSavedTitle(result.data.title);
        setLastSavedContent(result.data.content || "");
      }
    } catch (error) {
      console.error("Error loading note:", error);
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  const saveNote = useCallback(async () => {
    if (
      !note ||
      (content === lastSavedContent && title === lastSavedTitle) ||
      !content
    ) {
      return;
    }

    try {
      const updateNote: Note = {
        ...note,
        title,
        content,
      };

      const result = await NotesService.saveNote(updateNote);
      if (result.success) {
        setLastSavedTitle(title);
        setLastSavedContent(content);
        fetchNotes();
      }
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    }
  }, [note, title, content, lastSavedContent, lastSavedTitle]);

  useEffect(() => {
    loadNote();
  }, [noteId, loadNote]);

  useEffect(() => {
    if (!isLoading && title !== lastSavedTitle && note) {
      const timeoutId = setTimeout(() => {
        saveNote();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [title, lastSavedTitle, saveNote, isLoading]);

  useEffect(() => {
    if (content !== lastSavedContent) {
      saveNote();
    }
  }, [content, lastSavedContent, saveNote, isLoading]);

  useFocusEffect(
    useCallback(() => {
      const subscription = AppState.addEventListener(
        "change",
        (nextAppState: AppStateStatus) => {
          if (
            appState.current === "active" &&
            nextAppState.match(/inactive|background/)
          ) {
            saveNote();
          }
          appState.current = nextAppState;
        }
      );

      return () => {
        subscription.remove();
        saveNote();
      };
    }, [saveNote])
  );

  return {
    editor,
    title,
    setTitle,
  };
}
