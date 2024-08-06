import { ReactEditor, Slate } from "slate-react";
import { Editor, Element as SlateElement, Range, Transforms, apply, Point, above } from 'slate';
import { BulletedListElement, CodeBlockElement } from "../vite-env";


const SHORTCUTS: Record<string, string> = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six',
  '```': 'code-block'
};

export const withShortcuts = (editor: Editor) => {
  const {  deleteBackward, insertText, onChange } = editor;

  editor.insertText = text => {
    const { selection } = editor;
    if (text.endsWith(' ') && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection;
      const block = Editor.above(
        editor,
        {
          match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n)
        }
      );
      const path = block ? block[1] : [];
      const start = Editor.start(editor, path);
      const range = { anchor, focus: start };
      const beforeText = Editor.string(editor, range) + text.slice(0, -1);
      const type = SHORTCUTS[beforeText];
      if (type) {
        Transforms.select(editor, range);

        if (!Range.isCollapsed(range)) {
          Transforms.delete(editor);
        }

        const newProperties: Partial<SlateElement> = {
          // @ts-ignore
          type: type
        };

        if (type === 'code-block') {
          const codeBlock: CodeBlockElement = {
            type: 'code-block',
            children: []
          };
          Transforms.wrapNodes(editor, codeBlock);
          return;
        }

        Transforms.setNodes<SlateElement>(editor, newProperties, {
          match(n) {
            return SlateElement.isElement(n) && Editor.isBlock(editor, n);
          }
        });

        if (type === 'list-item') {
          const list: BulletedListElement = {
            type: 'bulleted-list',
            children: []
          }

          Transforms.wrapNodes(editor, list, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'list-item'
          });

          return;
        }
      }
    }

    insertText(text);
  };

  editor.onChange = options => {
    return onChange(options);
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const match = Editor.above(
        editor,
        {
          match(n) {
            return SlateElement.isElement(n) && Editor.isBlock(editor, n);
          }
        }
      );

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          SlateElement.isElement(block) &&
          block.type !== 'paragraph' &&
          Point.equals(selection.anchor, start)
        ) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph'
          };

          Transforms.setNodes(editor, newProperties);

          if (block.type === 'list-item') {
            Transforms.unwrapNodes(
              editor,
              {
                match(n) {
                  return !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'bulleted-list';
                },
                split: true
              }
            );
          }

          return;
        }
      }
      deleteBackward(...args);
    }
  }

  return editor;
};