import { Editor, Path, Transforms } from "slate";
import { getLine } from ".";

export function formatLine(editor: Editor, attrs: any, at: Path) {
  const [_, path] = getLine(editor, at);
  if (!path) return;
  Transforms.setNodes(
    editor,
    attrs,
    {
      at: path
    }
  )
}