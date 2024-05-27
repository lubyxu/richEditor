import { RenderElementProps } from "slate-react"

export const Column = function ({ attributes, className, children }: RenderElementProps & { className?: string }) {

  return (
    <div {...attributes} className={`grid grid-cols-${children.length}`}>
      {
        children
      }
    </div>
  )
}