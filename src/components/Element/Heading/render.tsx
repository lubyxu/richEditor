import React from 'react';
import { RenderElementProps } from "slate-react"
import { HeadingElement } from "../../../vite-env"

export const Heading = function ({ attributes, element, className, children }: RenderElementProps & { className?: string }) {
  const ele = element as HeadingElement;
  const level = ele.level;
  const tag = `h${level + 1}`;

  return React.createElement(
    tag,
    {
      ...attributes,
      children,
    }
  );

}