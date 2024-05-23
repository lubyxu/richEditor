import { EditableProps } from "slate-react/dist/components/editable";
import { Heading } from "./Heading/render";
import { Image } from "./Image/render";
import { Paragraph } from "./Paragraph/render";


export const renderElement: EditableProps['renderElement'] = function (props) {
  const { attributes, children, element } = props;
  const indent = element.indent;
  switch (element.type) {
    case 'heading':
      return <Heading {...props} />;
    case 'image':
      return <Image {...props} />;
    default:
      return <Paragraph {...props} />;
  }
}