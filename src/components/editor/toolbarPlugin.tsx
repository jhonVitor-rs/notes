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

interface ToolbarProps {
  editor: EditorBridge;
  hidden?: boolean;
}

export const toolbarStyles = StyleSheet.create({});

export function ToolbarPlugin({ editor, hidden = undefined }: ToolbarProps) {
  const editorState = useBridgeState(editor);
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
    case ToolbarContext.Link:
      return (
        <EditLinkBar
          theme={editor.theme}
          initialLink={editorState.activeLink}
          onBlur={() => {
            if (Platform.OS === "web") {
              // On web blur is called before onEditLink. This isn't an ideal fix however this is going to be change soon when we
              // add the new api for toolbar where we will have more control. This is a temporary fix for now.
              setTimeout(() => {
                setToolbarContext(ToolbarContext.Main);
              }, 100);
            } else {
              setToolbarContext(ToolbarContext.Main);
            }
          }}
          onLinkIconClick={() => {
            setToolbarContext(ToolbarContext.Main);
            editor.focus();
          }}
          onEditLink={(link) => {
            editor.setLink(link);
            editor.focus();

            if (Platform.OS === "android") {
              // On android we dont want to hide the link input before we finished focus on editor
              // Add here 100ms and we can try to find better solution later
              setTimeout(() => {
                setToolbarContext(ToolbarContext.Main);
              }, 100);
            } else {
              setToolbarContext(ToolbarContext.Main);
            }
          }}
        />
      );
  }
}
