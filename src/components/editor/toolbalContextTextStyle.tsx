import { Images } from "@10play/tentap-editor/src/assets";
import {
  ToolbarContext,
  ToolbarItem,
} from "@10play/tentap-editor/src/RichText/Toolbar/actions";

export const TEXT_STYLE_ITEMS: ToolbarItem[] = [
  {
    onPress:
      ({ setToolbarContext, toolbarContext }) =>
      () =>
        setToolbarContext(ToolbarContext.Main),
    active: () => false,
    disabled: () => false,
    image: () => Images.close,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBold(),
    active: ({ editorState }) => editorState.isBoldActive,
    disabled: ({ editorState }) => !editorState.canToggleBold,
    image: () => Images.bold,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleItalic(),
    active: ({ editorState }) => editorState.isItalicActive,
    disabled: ({ editorState }) => !editorState.canToggleItalic,
    image: () => Images.italic,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleUnderline(),
    active: ({ editorState }) => editorState.isUnderlineActive,
    disabled: ({ editorState }) => !editorState.canToggleUnderline,
    image: () => Images.underline,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleStrike(),
    active: ({ editorState }) => editorState.isStrikeActive,
    disabled: ({ editorState }) => !editorState.canToggleStrike,
    image: () => Images.strikethrough,
  },
];
