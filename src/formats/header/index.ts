import { Editor, Location, Node, Path, Transforms } from "slate";
import { BaseFormat } from '../base';
import * as helpers from '../../helpers/utils';
import { IKeyDownContext } from "../../vite-env";

export class Header extends BaseFormat {
  static key = 'Header';
  constructor(editor: Editor) {
    super(editor);
  }

  create(path: Path, { prefix }: { prefix: string }) {
    helpers.formatLine(this.editor, { type: 'heading', level: prefix.length }, path);
    helpers.setSelection(this.editor, path, 0);
  }

  onKeyDown(e: React.KeyboardEvent, ctx: IKeyDownContext) {
    if (/^(#{1,})/.test(ctx.prefix) && e.key === ' ') {
      const line = ctx.line;

      Transforms.delete(this.editor, {
        at: {
          anchor: { path: [...line[1], 0], offset: 0 },
          focus: { path: [...line[1], 0], offset: ctx.prefix.length }
        },
        unit: 'word',
        voids: true
      });

      this.create(ctx.line[1], { prefix: ctx.prefix });
    }
  }
}