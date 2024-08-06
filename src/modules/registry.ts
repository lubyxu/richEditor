import { Editor } from "slate";
import { ModuleInterface } from '../vite-env';
import { List } from "../formats/list";
import { Header } from "../formats/header";

const registry: Record<string, ModuleInterface> = {};

export function withRegistry(editor: Editor): Editor {
  registry[List.key] = new List(editor);
  registry[Header.key] = new Header(editor);
  editor.getModule = function (name: string) {
    return registry[name];
  };

  return editor;

};

