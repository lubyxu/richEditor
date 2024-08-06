import { Editor, Element, Node, NodeEntry, range, Text } from "slate";
import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

export const decorate = function ([node, path]: NodeEntry) {
  const ranges: any = [];

  if (!Text.isText(node)) {
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
    ...Prism.languages.markdown,
  });

  let start = 0;

  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;

    if (typeof token !== 'string') {
      ranges.push({
        [token.type]: true,
        anchor: { path, offset: start },
        focus: { path, offset: end }
      });
    }
    start = end;
  }

  return ranges;
  
}