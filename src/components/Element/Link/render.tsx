import { RenderElementProps } from "slate-react"
import { LinkElement } from "../../../vite-env";

export const Link = function ({ attributes, className, children, element }: RenderElementProps & { className?: string }) {
  const href = (element as LinkElement).href;
  return (
    <a {...attributes} href={href}>{children}</a>
  );
}