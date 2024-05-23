import { EditableProps } from "slate-react/dist/components/editable";

export const renderLeaf: EditableProps['renderLeaf'] = function ({ attributes, children, leaf }) {
  return (
    <span {...attributes}>{children}</span>
  );
}