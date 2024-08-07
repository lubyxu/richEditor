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

    const curContext = getMatchNodes(this.editor);
    const bindings = (this.bindings[e.key] || []).concat(this.bindings[e.which] || []);

    const matches = bindings.filter(binding => Keyboard.match(e, binding));

    const prevented = matches?.some(binding => {
      if (binding.prefix && !binding.prefix.test(curContext.prefix)) {
        return false;
      }
      if (binding.suffix && !binding.suffix.test(curContext.suffix)) {
        return false;
      }

      return binding.handler?.call(this, curContext);

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

function normalizeRange(range: Range) {
  const { anchor, focus } = range;
  const isBackward = Range.isBackward(range);
  return [
    isBackward ? focus : anchor,
    isBackward ? anchor : focus,
  ]
}

function getMatchNodes(editor: Editor) {
  const selection = editor.selection!;
  const [start, end] = normalizeRange(selection);
  const firstLine = [...SlateNode.ancestors(editor, start.path, { reverse: true })].find(([node]) => {
    return 'type' in node && ['paragraph', 'heading'].includes(node.type);
  });

  const lastLine = [...SlateNode.ancestors(editor, end.path, { reverse: true })].find(([node]) => {
    return 'type' in node && ['paragraph', 'heading'].includes(node.type);
  });

  const prefix = Editor.string(editor, { anchor: { path: firstLine![1], offset: 0 }, focus: start });
  const suffix = Editor.string(editor, { anchor: end, focus: Editor.end(editor, lastLine![1]) });

  return {
    line: start,
    prefix,
    suffix,
    empty: !prefix && !suffix && Range.isCollapsed(selection),
    collapsed: Range.isCollapsed(selection),
  };
}

