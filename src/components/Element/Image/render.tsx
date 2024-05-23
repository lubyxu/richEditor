import { RenderElementProps } from "slate-react"
import { ImageElement } from "../../../vite-env"

export const Image = function ({ attributes, className, element, children }: RenderElementProps & { className?: string }) {
  const ele = element as ImageElement;
  const values = ele.values;
  return (
    <div {...attributes} contentEditable={false}>
      {
        values.map((item, index) => (
          <img key={index} src={item.url} />
        ))
      }
    </div>
  )
}