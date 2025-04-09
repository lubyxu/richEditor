import React from 'react'
import { RenderElementProps } from "slate-react"

export const Slice = function ({ attributes, className, children }: RenderElementProps & { className?: string }) {
  return (
    <div {...attributes}>
      {
        children
      }

      <div contentEditable={false} style={{height: 70, background: '#fff', border: '1px solid #ddd'}}>
        <span>&nbsp;</span>
      </div>
    </div>
  )
}