import { RenderElementProps } from "slate-react"

export const Paragraph = function ({ attributes, className, children }: RenderElementProps & { className?: string }) {
  return (
    <p className={className} {...attributes}>{children}</p>
  )
}