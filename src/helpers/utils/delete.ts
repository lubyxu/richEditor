import { Editor, Path, Transforms } from "slate";
import { CustomText } from "../../vite-env";

export function deleteLine(editor: Editor, at: Path) {
  Transforms.removeNodes(
    editor,
    {
      at,
      match(n) {
        return !!(n as CustomText).text;
      }
    }
  );

}
