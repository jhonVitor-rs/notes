import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  TextInput,
  AppState,
  AppStateStatus,
  Pressable,
  Text,
} from "react-native";
import {
  CoreBridge,
  darkEditorTheme,
  RichText,
  TenTapStartKit,
  useEditorBridge,
  useEditorContent,
} from "@10play/tentap-editor";
import { editorTheme } from "@/components/editor/theme";
import { ToolbarPlugin } from "@/components/editor/toolbarPlugin";
import { router, useFocusEffect, useNavigation } from "expo-router";
import { Note } from "@/utils/types/note";
import { SaveNote } from "@/utils/storage/addNote";
import { useNotes } from "@/providers/notesProvider";
import { GetNote } from "@/utils/storage/getNote";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions } from "@react-navigation/native";

export default function Basic() {
  const { note, setNote, fetchNotes } = useNotes();
  const appState = useRef(AppState.currentState);
  const [title, setTitle] = useState(note.title);
  const [lastSavedTitle, setLastSavedTitle] = useState(note.title);
  const [lastSavedContent, setLastSavedContent] = useState(note.content || "");
  const navigation = useNavigation();

  // Atualiza o estado do título e o último título salvo quando a nota mudar
  useEffect(() => {
    setTitle(note.title);
    setLastSavedTitle(note.title);
    setLastSavedContent(note.content || "");
  }, [note.id]);

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: note.content,
    theme: darkEditorTheme,
    bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(editorTheme)],
  });

  const content = useEditorContent(editor, {
    type: "html",
    debounceInterval: 500,
  }) as string;

  const handleGoBack = async () => {
    if (note.fatherId) {
      // Salva a nota atual antes de navegar
      await saveNote();

      const { success, data } = await GetNote(note.fatherId);
      if (success) {
        const parentNote = data as Note;
        setNote(parentNote);
        router.push(`/(notes)/${parentNote.id}`);
      } else {
        alert("Note not found");
      }
    }
  };

  const saveNote = async () => {
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

      const { success } = await SaveNote(updateNote);
      if (success) {
        setLastSavedTitle(title);
        setLastSavedContent(content);
        fetchNotes();
      }
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
    }
  };

  // Efeito para salvar quando o título mudar
  useEffect(() => {
    if (title !== lastSavedTitle) {
      saveNote();
    }
  }, [title]);

  // Efeito para salvar quando o conteúdo mudar
  useEffect(() => {
    if (content !== lastSavedContent) {
      saveNote();
    }
  }, [content]);

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
    }, [note.id, saveNote])
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-700">
      <View className="px-2 py-2 flex flex-row items-center gap-4">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color="white" />
        </Pressable>
        {note.fatherId && (
          <Pressable onPress={handleGoBack} className="mr-3">
            <Text>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Text>
          </Pressable>
        )}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título da nota"
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-xl font-bold text-white mb-2 pb-2 pr-4 border-b border-cyan-600"
        />
      </View>
      <RichText editor={editor} className="" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute w-full bottom-0"
      >
        <ToolbarPlugin editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
