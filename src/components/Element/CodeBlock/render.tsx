import { RenderElementProps } from "slate-react"
import c from './index.module.less';

export const CodeBlock = function ({ attributes, className, children }: RenderElementProps & { className?: string }) {
  return (
    <div className={c.root + ' ' + className} {...attributes}>{children}</div>
  )
}