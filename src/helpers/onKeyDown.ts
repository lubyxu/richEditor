import { Editor, Element as SlateElement, Path, Range, Point, Node as SlateNode, Text, NodeEntry } from "slate"
import { CustomElement, CustomText } from "../vite-env";


interface ICursorContext {
  nodeEntries: NodeEntry[];
}

export const onKeyDown = function (this: Editor, e: React.KeyboardEvent) {
  const ctx: ICursorContext = {};

  const selection = this.selection;
  if (!selection) return;
  const [node, path] = Editor.node(this, selection);
  const ancestors = SlateNode.ancestors(this, path);
  const nodes = [...ancestors].filter(([node, path]) => SlateElement.isElement(node) || Text.isText(node));

  const paths = [...Range.points(selection)];
  console.log('paths :>> ', paths);

}