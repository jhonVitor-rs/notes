import { useState } from "react";
import { Text, View } from "react-native";

export default function Note() {
  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");

  return (
    <View>
      <Text>Notes</Text>
    </View>
  );
}
