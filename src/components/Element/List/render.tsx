import React from 'react';
import { RenderElementProps } from "slate-react"
import { ListElement } from "../../../vite-env"

// const DATA = [
//   {
//     type: 'list',
//     children: [
//       {
//         type: 'paragraph',
//         children: [
//           {
//             text: 'hahahahaah'
//           }
//         ]
//       }
//     ]
//   }
// ]

export const List = function ({ attributes, element, className, children }: RenderElementProps & { className?: string }) {
  const ele = element as ListElement;
  const unorder = ele.unorder;
  if (unorder) {
    return (
      <ul {...attributes}>{children}</ul>
    );
  }
  else {
    return (
      <ol {...attributes}>{children}</ol>
    )
  }
}