import { Editor, Path, Range, Selection, Transforms, Node as SlateNode, NodeEntry, Point } from "slate";
import Module from "./module";
import { CustomElement } from "../vite-env";

const SHORTKEY = /Mac/i.test(navigator.platform) ? 'metaKey' : 'ctrlKey';

/**
 * keyboard.addBinding(
 *  {
 *    shiftKey: true,
 *    key: 'Enter',
 *  },
 *  {
 *    collapsed: true,
 *    offset: 0,
 *    formats: [
 *      { type: 'type', name: 'heading', value: 1 },
 *      { type: 'attributes', name: 'bold', value: 'true' },
 *      { type: 'attributes', name: 'level', value: '1' },
 *    ]
 *  },
 *  handler(point, { ancestors, collapsed, empty, prefix, suffix }) {}
 * )
 */

interface IContext {
  ancestors: CustomElement[];
  line: CustomElement[];
  offset: number;
  collapsed: boolean;
  empty: boolean;
  prefix: string;
  suffix: string;
}

interface BindingObject {
  key: number | string | string[];
  shortKey?: boolean | null;
  shiftKey?: boolean | null;
  altKey?: boolean | null;
  metaKey?: boolean | null;
  ctrlKey?: boolean | null;
  prefix?: RegExp;
  suffix?: RegExp;
  handler?(this: Editor, selection: Selection, context: IContext): boolean | void;
}

type Binding = BindingObject | string | number;
interface NormalizedBinding extends Omit<BindingObject, 'key' | 'shortKey'> {
  key: string | number;
}

interface KeyboardOptions {
  bindings: Record<string, Binding>
}

export class Keyboard extends Module<KeyboardOptions> {
  bindings: Record<string, NormalizedBinding[]>;

  static match(evt: React.KeyboardEvent, binding: BindingObject) {
    if (
      (['altKey', 'ctrlKey', 'metaKey', 'shiftKey'] as const).some(key => {
        return !!binding[key] !== evt[key] && binding[key] !== null
      })
    ) {
      return false;
    }
    return binding.key === evt.key || binding.key === evt.which;
  }

  constructor(editor: Editor, options: Partial<KeyboardOptions>) {
    super(editor, options);
    this.bindings = {};

  }

  addBinding(
    keyBinding: Binding,
    context:
      | Required<BindingObject['handler']>
      | Partial<Omit<BindingObject, 'key' | 'handler'>> = {},
    handler:
      | Required<BindingObject['handler']>
      | Partial<Omit<BindingObject, 'key' | 'handler'>> = {},
  ) {
    const binding = normalize(keyBinding);
    if (!binding) {
      console.error('无法注册函数', binding);
      return;
    }

    if (typeof context === 'function') {
      context = { handler: context };
    }

    if (typeof handler === 'function') {
      handler = { handler };
    }

    const keys = Array.isArray(binding.key) ? binding.key : [binding.key];
    keys.forEach(key => {
      const singleBinding = {
        ...binding,
        key,
        ...context,
        ...handler
      };
      this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
      this.bindings[singleBinding.key].push(singleBinding);
    })
  }

  onKeyDown(e: React.KeyboardEvent) {
    const selection = this.editor.selection;
    if (!selection) return;

    if (!Range.isCollapsed(selection)) {
      Transforms.delete(this.editor, {
        at: selection!
      });
    }

    const matchedNodes = getMatchNodes(this.editor, selection.anchor.path);
    const bindings = (this.bindings[e.key] || []).concat(this.bindings[e.which] || []);

    const matches = bindings.filter(binding => Keyboard.match(e, binding));

    const prevented = matches?.some(match => {

      const { node, path, suffix, prefix } = match;

    });
  }
}

function normalize(binding: Binding): BindingObject | null {
  if (typeof binding === 'string' || typeof binding === 'number') {
    binding = { key: binding };
  }
  else if (typeof binding === 'object') {
    binding = { ...binding };
  }
  else {
    return null;
  }

  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
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

  return {
    line: ancesetorsInContainer[ancesetorsInContainer.length - 1][0],
    path: ancesetorsInContainer[ancesetorsInContainer.length - 1][1],
  };

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

