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
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { Note } from "@/utils/types/note";
import { SaveNote } from "@/utils/storage/addNote";
import { useNotes } from "@/providers/notesProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerActions } from "@react-navigation/native";
import { NotesService } from "@/utils/storage/notes";
import { EditorHooks } from "@/hooks/editor";

export default function Editor() {
  const { noteId } = useLocalSearchParams<{ noteId: string }>();
  const appState = useRef(AppState.currentState);
  const navigation = useNavigation();
  const { editor, title, setTitle } = EditorHooks({ noteId, appState });

  return (
    <SafeAreaView className="flex-1 bg-slate-700">
      <View className="px-2 py-2 flex flex-row items-center gap-4">
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color="white" />
        </Pressable>
        {/* {note.fatherId && (
          <Pressable onPress={handleGoBack} className="mr-3">
            <Text>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Text>
          </Pressable>
        )} */}
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
