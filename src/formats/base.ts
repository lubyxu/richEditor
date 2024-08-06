import { Editor } from "slate";
import { IKeyDownContext } from "../vite-env";

export class BaseFormat {
  editor: Editor;
  constructor(editor: Editor) {
    this.editor = editor;
  }

  onKeyDown(e: React.KeyboardEvent, ctx: IKeyDownContext): void { }
}