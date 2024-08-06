import { Editor, Element as SlateElement, Path, Range, Point, Node as SlateNode, Text, NodeEntry, Transforms, Selection, select, Node } from "slate"
import { BindingObject, CustomElement, CustomText, IKeyDownContext } from "../vite-env";
import * as helpers from './utils';
import { bindings as markdownBindings } from './makdown';

interface ICursorContext {
  prefix: string
}

function deleteRange(editor: Editor, selection: Selection) {
  Transforms.delete(editor, {
    at: selection!
  });
}

function getMatchNodes(editor: Editor, path: Path) {
  const selection = editor.selection;
  if (!selection) return;
  const ancestors = [...SlateNode.ancestors(editor, path, { reverse: true })];
  let ancesetorsInContainer: NodeEntry<CustomElement>[] = [];
  for (let nodeEntry of ancestors) {
    const [node, path] = nodeEntry;
    if ('type' in node && node.type === 'column') break;
    ancesetorsInContainer.push([node as CustomElement, path]);
  }

  return ancesetorsInContainer.map(([node, path]) => {
    const prefix = Editor.string(editor, { anchor: { path, offset: 0 }, focus: selection.anchor });
    const suffix = Editor.string(editor, { anchor: selection.anchor, focus: Editor.end(editor, path) });
    return {
      node,
      path,
      prefix,
      suffix
    }
  });
}

function getPrefixText(editor: Editor, ctx: IKeyDownContext, at: Point) {
  const [line, path] = ctx.line;
  const str = Editor.string(editor, { anchor: { path: path as Path, offset: 0 }, focus: at });
  return str;
}

function getSuffixText(editor: Editor, ctx: IKeyDownContext, at: Point) {
  const [line, path] = ctx.line;
  const [_, end] = Editor.edges(editor, path!);
  const str = Editor.string(editor, { anchor: at, focus: end });
  return str;
}


function headerFormat(this: Editor, selection: Range) {
  const { anchor, focus } = selection;

  const [_, path] = helpers.getLine(this, anchor.path);
  if (!path) return;

  helpers.deleteLine(this, path);
  helpers.formatLine(this, { type: 'heading', level: anchor.offset - 1 }, anchor.path);
  helpers.setSelection(this, anchor.path, 0);
}

function match(evt: React.KeyboardEvent, binding: BindingObject) {
  if (
    (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const).some(key => {
      return !!binding[key] != evt[key] && binding[key] != null
    })
  ) {
    return false;
  }
  return binding.key === evt.key || binding.key === evt.which;
}

export const onKeyDown = function (this: Editor, e: React.KeyboardEvent) {
  return;
  const ctx: IKeyDownContext = {} as IKeyDownContext;
  const bindings: BindingObject[] = [
    ...markdownBindings
  ];

  const isComposing = e.keyCode === 229 && (e.key === 'Enter' || e.key === 'Backspace');
  if (isComposing) {
    return;
  }

  const selection = this.selection;
  if (!selection) return;
  // todo delete the range
  // const matches = bindings.filter(binding => match(e, binding));
  // if (!matches.length) return;

  const line = helpers.getLine(this, selection.anchor.path);
  if (!line.length) return;
  ctx.line = line;
  ctx.offset = selection.anchor.offset;
  ctx.prefix = getPrefixText(this, ctx, selection.anchor);
  ctx.suffix = getSuffixText(this, ctx, selection.anchor);
  ctx.empty = 'children' in line[0]! ? !line[0].children.length : false;

  const header = this.getModule('Header');
  const list = this.getModule('List');
  [header, list].forEach(module => {
    module.onKeyDown(e, ctx);
  });



  // const prevented = matches.some(binding => {
  //   if (binding.prefix && !binding.prefix.test(ctx.prefix)) {
  //     return false;
  //   }
  //   if (binding.suffix && !binding.suffix.test(ctx.suffix)) {
  //     return false;
  //   }
  //   return binding.handler.call(this, ctx);
  // });
  // if (prevented) {
  //   return e.preventDefault();
  // }

}