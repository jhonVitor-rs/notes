import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TreeView } from "@lexical/react/LexicalTreeView";

export function TreeViewPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <TreeView
      viewClassName="block bg-slate-900 text-white p-2 text-xs whitespace-pre-wrap max-h-[400px] relative overflow-auto"
      treeTypeButtonClassName="debug-treetype-button"
      timeTravelPanelClassName="overflow-hidden pl-2 m-auto flex"
      timeTravelButtonClassName="border-0 p-0 text-sm top-2 right-3 absolute bg-none text-white"
      timeTravelPanelSliderClassName="p-0 flex-8"
      timeTravelPanelButtonClassName="p-0 border-0 bg-none flex-1 text-white text-sm"
      editor={editor}
    />
  );
}
