import { useState } from "react";
import { FlatList, StyleSheet, Platform } from "react-native";
import {
  EditorBridge,
  useBridgeState,
  useKeyboard,
} from "@10play/tentap-editor";
import { ToolbarItemComp } from "@10play/tentap-editor/src/RichText/Toolbar/ToolbarItemComp";
import { ToolbarContext } from "@10play/tentap-editor/src/RichText/Toolbar/actions";
import { EditLinkBar } from "@10play/tentap-editor/src/RichText/Toolbar/EditLinkBar";
import { TEXT_STYLE_ITEMS } from "./toolbalContextTextStyle";
import { TOOLBAR_CONTEXT_MAIN } from "./toolbarContextMain";
import { TOOLBAR_CONTEXT_LISTS } from "./toolbarContextLists";
import { useNotes } from "@/providers/notesProvider";
import { EditNestedNoteBar } from "./addNestedNoteBar";
import { Note } from "@/utils/types/note";
import { GenId } from "@/utils/storage/genId";

interface ToolbarProps {
  editor: EditorBridge;
  hidden?: boolean;
}

export const toolbarStyles = StyleSheet.create({});

export function ToolbarPlugin({ editor, hidden = undefined }: ToolbarProps) {
  const editorState = useBridgeState(editor);
  const { note } = useNotes();
  const { isKeyboardUp } = useKeyboard();
  const [toolbarContext, setToolbarContext] = useState<ToolbarContext>(
    ToolbarContext.Main
  );

  const hideToolbar =
    hidden === undefined ? !isKeyboardUp || !editorState.isFocused : hidden;

  const args = {
    editor,
    editorState,
    setToolbarContext,
    toolbarContext,
  };

  const handleContext = (context: ToolbarContext) => {
    if (context === ToolbarContext.Main) return TOOLBAR_CONTEXT_MAIN;
    else if (context === ToolbarContext.Lists) return TOOLBAR_CONTEXT_LISTS;
    else if (context === ToolbarContext.TextStyle) return TEXT_STYLE_ITEMS;
    else return TOOLBAR_CONTEXT_MAIN;
  };

  switch (toolbarContext) {
    case ToolbarContext.Main:
    case ToolbarContext.TextStyle:
    case ToolbarContext.Lists:
      return (
        <FlatList
          data={handleContext(toolbarContext)}
          style={[
            editor.theme.toolbar.toolbarBody,
            hideToolbar ? editor.theme.toolbar.hidden : undefined,
          ]}
          renderItem={({ item }) => {
            return <ToolbarItemComp {...item} args={args} editor={editor} />;
          }}
          horizontal
        />
      );
  }
}
