import { Editor } from "slate";

abstract class Module<T extends {} = {}> {
  constructor(public editor: Editor, protected options: Partial<T> = {}) {
  }
}

export default Module;