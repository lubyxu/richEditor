import { EditableProps } from "slate-react/dist/components/editable";

export const renderLeaf: EditableProps['renderLeaf'] = function ({ attributes, children, leaf }) {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  return (
    <span {...attributes}>{children}</span>
  );
}