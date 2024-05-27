import { Editor, Element as SlateElement, Path, Range, Point, Node as SlateNode, Text, NodeEntry, Transforms, Selection, select } from "slate"
import { CustomElement, CustomText } from "../vite-env";


interface ICursorContext {
  elements: ({ node: CustomElement; path: Path; suffix: string; prefix: string; })[]
}

function deleteRange(editor: Editor, selection: Selection) {
  Transforms.delete(editor, {
    at: selection!
  });
}

function getMatchNodes(editor: Editor, path: Path) {
  const selection = editor.selection;
  if (!selection) return;
  const ancestors = [...SlateNode.ancestors(editor, path, { reverse: true })];
  let ancesetorsInContainer: NodeEntry<CustomElement>[] = [];
  for (let nodeEntry of ancestors) {
    const [node, path] = nodeEntry;
    if ('type' in node && node.type === 'column') break;
    ancesetorsInContainer.push([node as CustomElement, path]);
  }

  return ancesetorsInContainer.map(([node, path]) => {
    const prefix = Editor.string(editor, { anchor: { path, offset: 0 }, focus: selection.anchor });
    const suffix = Editor.string(editor, { anchor: selection.anchor, focus: Editor.end(editor, path) });
    return {
      node,
      path,
      prefix,
      suffix
    }
  });

}

export const onKeyDown = function (this: Editor, e: React.KeyboardEvent) {
  const ctx: ICursorContext = {};

  const selection = this.selection;
  if (!selection) return;

  if (!Range.isCollapsed(selection)) {
    deleteRange(this, selection);
  }

  const matches = getMatchNodes(this, selection.anchor.path);


}