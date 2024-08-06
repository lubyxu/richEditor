import { Editor, Location, Node, Path, Transforms } from "slate";
import { BaseFormat } from '../base';
import { IKeyDownContext } from "../../vite-env";

export class List extends BaseFormat {
  static key = 'List';
  constructor(editor: Editor) {
    super(editor);
  }

  create(path: Path) {
    // const range = Editor.range(this.editor, (ctx.line[1] || this.editor.selection)!);
    // const [start] = Editor.edges(this.editor, range);
    // const [_, path] = helpers.getLine(this.editor, start.path);
    Transforms.wrapNodes(this.editor, { type: 'list', unorder: false, children: [] }, {
      at: path
    });

  }

  onKeyDown(e: React.KeyboardEvent, ctx: IKeyDownContext) {
    if (/^-/.test(ctx.prefix) && e.key === ' ') {
      const line = ctx.line;
      Transforms.delete(this.editor, {
        at: {
          anchor: { path: line[1], offset: 0 },
          focus: { path: line[1], offset: ctx.prefix.length }
        }
      });
      this.create(ctx.line[1]);
    }
  }
}