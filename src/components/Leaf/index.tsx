import { EditableProps } from "slate-react/dist/components/editable";
import { css } from '@emotion/css'

export const renderLeaf: EditableProps['renderLeaf'] = function ({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  let className = attributes.className || '';
  if (leaf.token) {
    const type = leaf.type;
    className = 'token ' + type;
  }
  return (
    <span
      {...attributes}
      className={className}
      // className={
      //   css`
      //     font-weight: ${leaf.bold && 'bold'};
      //     font-style: ${ leaf.italic && 'italic' };
      //     text-decoration: ${leaf.underline && 'underline'};
      //     ${
      //       leaf.title && css`
      //         display: inline-block;
      //         font-weight: bold;
      //         font-size: 20px;
      //         margin: 20px 0 10px 0;
      //       `
      //     }
      //     ${
      //       leaf.list && css`
      //         padding-left: 10px;
      //         font-size: 20px;
      //         line-height: 10px;
      //       `
      //     }
      //     ${
      //       leaf.hr && css`
      //         display: block;
      //         text-align: center;
      //         border-bottom: 2px solid #ddd;
      //       `
      //     }
      //     ${
      //       leaf.blockquote && css`
      //         display: inline-block;
      //         border-left: 2px solid #ddd;
      //         padding-left: 10px;
      //         color: #aaa;
      //         font-style: italic;
      //       `
      //     }
      //     ${
      //       leaf.code && css`
      //         font-family: monospace;
      //         background-color: #eee;
      //         padding: 3px;
      //       `
      //     }
      //   `
      // }
    >
      {children}
    </span>
  );
}