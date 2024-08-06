import { Editor, Element, Node, NodeEntry, Path } from "slate";
import { CustomElement } from "../../vite-env";


export function getLine(editor: Editor, path: Path): NodeEntry<CustomElement> | [] {
  const ancestors = [...Node.ancestors(editor, path, { reverse: true })];

  for (let [node, path] of ancestors) {
    if (Editor.isBlock(editor, node as CustomElement)) {
      return [node as CustomElement, path];
    }
  }
  return [];
}



export * from './delete';
export * from './selection';
export * from './format';