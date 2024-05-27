import { useMemo } from 'react'
import {
  createEditor,
  Descendant,
  Editor as SlateEditor,
  Range,
  Node
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
} from 'slate-react';

import { renderElement } from './components/Element';
import { renderLeaf } from './components/Leaf';
import { onKeyDown } from './helpers/onKeyDown';
import { withCustom } from './hooks/withCustom';

// @ts-ignore
window.Range = Range;
// @ts-ignore
window.SlateNode = Node;

const initalValue: Descendant[] = [
  {
    type: 'heading',
    level: 1,
    children: [
      {
        text: 'jdjdjd'
      },
      {
        text: 'j1212',
        bold: 1,
      },
      {
        text: 'ddd'
      },
    ]
  },
  {
    type: 'column',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'column1'
          },
          {
            type: 'link',
            href: 'https://www.baidu.com',
            children: [
              {
                text: '1212'
              }
            ]
          }
        ]
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'column2'
          }
        ]
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'column3'
          }
        ]
      }
    ]
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'paragraph'
      }
    ]
  }
];

// @ts-ignore
window.SlateEditor = SlateEditor;

function Editor() {
  const editor = useMemo(() => {
    return withCustom(withReact(createEditor()));
  }, []);
  // @ts-ignore
  window.editor = editor;
  return (
    <Slate editor={editor} initialValue={initalValue}>
      <Editable
        placeholder="输入内容"
        className='c-rich-editor mx-auto'
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown.bind(editor)}
      />
    </Slate>
  );
}

export default Editor;
