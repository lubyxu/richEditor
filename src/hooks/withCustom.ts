import { Editor } from "slate";

export function withCustom(editor: Editor): Editor {
  const { isInline, isVoid } = editor;

  editor.isInline = element => {
    return ['link'].includes(element.type) || isInline(element);
  };

  editor.isContainer = element => {
    return ['column'].includes(element.type);
  };

  return editor;
}