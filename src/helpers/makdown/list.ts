import { Editor, Path } from "slate";
import { BindingObject, IKeyDownContext } from "../../vite-env";
import { List } from "../../formats/list";

export const binding: BindingObject = {
  key: ' ',
  prefix: /^-/,
  handler(this: Editor, ctx: IKeyDownContext) {
    const listModule = this.getModule('list') as List;
    listModule.create(this.selection!);
  }
};