import { AssetsImages } from "@/utils/images";
import { Images } from "@10play/tentap-editor/src/assets";
import {
  ToolbarContext,
  ToolbarItem,
} from "@10play/tentap-editor/src/RichText/Toolbar/actions";
import { Platform } from "react-native";

export const TOOLBAR_CONTEXT_MAIN: ToolbarItem[] = [
  {
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.TextStyle),
    active: () => false,
    disabled: () => false,
    image: () => AssetsImages.textType,
  },
  {
    onPress:
      ({ setToolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Lists),
    active: () => false,
    disabled: () => false,
    image: () => AssetsImages.lists,
  },
  {
    onPress:
      ({ setToolbarContext, editorState, editor }) =>
      () => {
        if (Platform.OS === "android") {
          setTimeout(() => {
            editor.setSelection(
              editorState.selection.from,
              editorState.selection.to
            );
          });
        }
        setToolbarContext(ToolbarContext.Link);
      },
    active: ({ editorState }) => editorState.isLinkActive,
    disabled: ({ editorState }) =>
      !editorState.isLinkActive && !editorState.canSetLink,
    image: () => Images.link,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleCode(),
    active: ({ editorState }) => editorState.isCodeActive,
    disabled: ({ editorState }) => !editorState.canToggleCode,
    image: () => Images.code,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBlockquote(),
    active: ({ editorState }) => editorState.isBlockquoteActive,
    disabled: ({ editorState }) => !editorState.canToggleBlockquote,
    image: () => Images.quote,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.undo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canUndo,
    image: () => Images.undo,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.redo(),
    active: () => false,
    disabled: ({ editorState }) => !editorState.canRedo,
    image: () => Images.redo,
  },
];
