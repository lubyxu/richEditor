import { Editor, Path } from "slate";
import * as helpers from '../utils';
import { BindingObject, IKeyDownContext } from "../../vite-env";

export const binding: BindingObject = {
  key: ' ',
  prefix: /^(#{1})/,
  handler(this: Editor, ctx: IKeyDownContext) {
    const { line, prefix } = ctx;

    helpers.deleteLine(this, line[1]);
    helpers.formatLine(this, { type: 'heading', level: prefix.length }, line[1]);
    helpers.setSelection(this, line[1], 0);
  }
};