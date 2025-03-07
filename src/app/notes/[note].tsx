import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
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

export default function Basic({}: NativeStackScreenProps<any, any, any>) {
  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent,
    theme: darkEditorTheme,
    bridgeExtensions: [...TenTapStartKit, CoreBridge.configureCSS(editorTheme)],
  });

  const content = useEditorContent(editor, { type: "html" });
  // useEffect(() => {
  //   console.log(content);
  // }, [content]);

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <RichText editor={editor} className="" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={exampleStyles.keyboardAvoidingView}
      >
        <ToolbarPlugin editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const exampleStyles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  keyboardAvoidingView: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});

const initialContent = `<p>This is a basic example!</p>`;
