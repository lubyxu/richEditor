import { Editor, Path, Transforms } from "slate";

export function setSelection(editor: Editor, at: Path, offset = 0) {
  Transforms.select(
    editor,
    {
      path: at,
      offset
    }
  );
}