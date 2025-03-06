import { Images } from "@10play/tentap-editor/src/assets";
import {
  ToolbarContext,
  ToolbarItem,
} from "@10play/tentap-editor/src/RichText/Toolbar/actions";

export const TOOLBAR_CONTEXT_LISTS: ToolbarItem[] = [
  {
    onPress:
      ({ setToolbarContext }) =>
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
        editor.toggleTaskList(),
    active: ({ editorState }) => editorState.isTaskListActive,
    disabled: ({ editorState }) => !editorState.canToggleTaskList,
    image: () => Images.checkList,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleOrderedList(),
    active: ({ editorState }) => editorState.isOrderedListActive,
    disabled: ({ editorState }) => !editorState.canToggleOrderedList,
    image: () => Images.orderedList,
  },
  {
    onPress:
      ({ editor }) =>
      () =>
        editor.toggleBulletList(),
    active: ({ editorState }) => editorState.isBulletListActive,
    disabled: ({ editorState }) => !editorState.canToggleBulletList,
    image: () => Images.bulletList,
  },
  {
    onPress:
      ({ editor, editorState }) =>
      () =>
        editorState.canSink ? editor.sink() : editor.sinkTaskListItem(),
    active: () => false,
    disabled: ({ editorState }) =>
      !editorState.canSink && !editorState.canSinkTaskListItem,
    image: () => Images.indent,
  },
  {
    onPress:
      ({ editor, editorState }) =>
      () =>
        editorState.canLift ? editor.lift() : editor.liftTaskListItem(),
    active: () => false,
    disabled: ({ editorState }) =>
      !editorState.canLift && !editorState.canLiftTaskListItem,
    image: () => Images.outdent,
  },
];
