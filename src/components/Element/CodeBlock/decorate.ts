import { Editor, Element, Node, NodeEntry, range, Text } from "slate";
import Prism from 'prismjs';
// import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-javascript';


function isInCodeBlock([node, path]: NodeEntry) {
  for (const [n] of Node.ancestors(node, path, { reverse: true })) {
    if (!Editor.isEditor(n) && n.type === 'code-block') {
      return true;
    }
  }
  return false;
}

export const decorate = function ([node, path]: NodeEntry, editor: Editor) {
  const ranges: any = [];

  if (!Text.isText(node)) {
    return ranges;
  }

  const block = Editor.above(
    editor,
    {
      match: n => Element.isElement(n) && Editor.isBlock(editor, n)
    }
  );
  if (!block) {
    return ranges;
  }

  if (!isInCodeBlock([editor, block[1]])) {
    return ranges;
  }

  const getLength = (token: any) => {
    if (typeof token == 'string') {
      return token.length;
    }
    else if (typeof token.content == 'string') {
      return token.content.length;
    }
    else {
      return token.content.reduce((l: number, t: any) => l + getLength(t), 0);
    }
  }

  const tokens = Prism.tokenize(node.text, {
    ...Prism.languages.javascript,
  });

  console.log('tokens :>> ', tokens);

  let start = 0;

  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;

    if (typeof token !== 'string') {
      ranges.push({
        type: token.type,
        token: true,
        anchor: { path, offset: start },
        focus: { path, offset: end }
      });
    }
    start = end;
  }

  return ranges;
  
}