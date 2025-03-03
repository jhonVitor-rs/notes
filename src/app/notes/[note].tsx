import Editor from "@/components/editor";
import { useState } from "react";
import { Text, View } from "react-native";

export default function Note() {
  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");

  return (
    <View className="w-full min-h-screen">
      <Text>Notes</Text>
      <Editor setEditorState={setEditorState} setPlainText={setPlainText} />
    </View>
  );
}
