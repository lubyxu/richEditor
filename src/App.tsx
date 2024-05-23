import { useMemo } from 'react'
import {
  createEditor,
  Descendant,
} from 'slate'
import {
  Slate,
  Editable,
  withReact,
} from 'slate-react';

import { renderElement } from './components/Element';
import { renderLeaf } from './components/Leaf';
import { onKeyDown } from './helpers/onKeyDown';

const initalValue: Descendant[] = [
  {
    type: 'heading',
    level: 1,
    children: [
      {
        text: ''
      }
    ]
  }
];

function Editor() {
  const editor = useMemo(() => {
    return withReact(createEditor());
  }, []);
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
