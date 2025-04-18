import { useEffect, useMemo } from 'react'
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
  ReactEditor
} from 'slate-react';
import 'prismjs/themes/prism.css';

import { renderElement } from './components/Element';
import { renderLeaf } from './components/Leaf';
import { onKeyDown } from './helpers/onKeyDown';
import { withCustom } from './hooks/withCustom';
import { withRegistry } from './modules/registry';
import { withShortcuts } from './HOC/withShortcuts';
import { decorate } from './components/Element/CodeBlock/decorate';
import { DOMNode } from 'slate-react/dist/utils/dom';
// import { decorate } from './HOC/withMarkdownDecorate';


// @ts-ignore
window.Range = Range;
// @ts-ignore
window.SlateNode = Node;
// @ts-ignore
window.SlateEditor = SlateEditor;

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
  },
  {
    type: 'slice',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'paragraph1'
          }
        ]
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'paragraph2'
          }
        ]
      }
    ]
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'paragraph3'
      }
    ]
  }
];

// @ts-ignore
window.SlateEditor = SlateEditor;

function Editor() {
  const editor = useMemo(() => {
    const ret = withShortcuts(withReact(createEditor()));
    return ret;
  }, []);
  // @ts-ignore
  window.editor = editor;

  return (
    <Slate
      editor={editor}
      initialValue={initalValue}
      onChange={e => {
        const { selection } = editor;
        console.log('selection :>> ', selection);
      }}
    >
      <Editable
        decorate={(entry) => decorate(entry, editor)}
        placeholder="输入内容"
        className='c-rich-editor mx-auto'
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
}

export default Editor;
