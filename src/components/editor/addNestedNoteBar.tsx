import { AssetsImages } from "@/utils/images";
import { EditorTheme } from "@10play/tentap-editor";
import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface EditNestedNoteBarProps {
  theme: EditorTheme;
  onAddNestedNote: (noteTitle: string) => void;
  onCancelClick: () => void;
  currentNoteId: string;
}

export function EditNestedNoteBar({
  theme,
  onAddNestedNote,
  onCancelClick,
  currentNoteId,
}: EditNestedNoteBarProps) {
  const [noteTitle, setNoteTitle] = useState("");

  return (
    <View style={theme.toolbar.linkBarTheme.addLinkContainer}>
      <TouchableOpacity
        onPress={onCancelClick}
        style={[
          theme.toolbar.toolbarButton,
          theme.toolbar.linkBarTheme.linkToolbarButton,
        ]}
      >
        <View
          style={[theme.toolbar.iconWrapper, theme.toolbar.iconWrapperActive]}
        >
          <Image
            source={AssetsImages.page}
            style={[theme.toolbar.icon, theme.toolbar.iconActive]}
            resizeMode="contain"
          />
        </View>
      </TouchableOpacity>
      <TextInput
        value={noteTitle}
        onChangeText={setNoteTitle}
        placeholder="Digite o título da nota..."
        placeholderTextColor={theme.toolbar.linkBarTheme.placeholderTextColor}
        autoFocus
        style={theme.toolbar.linkBarTheme.linkInput}
      />
      <TouchableOpacity
        style={theme.toolbar.linkBarTheme.doneButton}
        onPress={() => {
          onAddNestedNote(noteTitle);
        }}
      >
        <Text style={theme.toolbar.linkBarTheme.doneButtonText}>Inserir</Text>
      </TouchableOpacity>
    </View>
  );
}
