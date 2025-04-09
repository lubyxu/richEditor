import { EditableProps } from "slate-react/dist/components/editable";
import { Heading } from "./Heading/render";
import { Image } from "./Image/render";
import { Paragraph } from "./Paragraph/render";
import { Column } from "./Column/render";
import { Link } from "./Link/render";
import { List } from "./List/render";
import { CodeBlock } from './CodeBlock/render';
import { Slice } from "./Slice/render";


export const renderElement: EditableProps['renderElement'] = function (props) {
  const { attributes, children, element } = props;
  const indent = element.indent;
  switch (element.type) {
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'heading':
      return <Heading {...props} />;
    case 'image':
      return <Image {...props} />;
    case 'column':
      return <Column {...props} />;
    case 'link':
      return <Link {...props} />;
    case 'list':
      return <List {...props} />
    case 'code-block':
      return <CodeBlock {...props} />;
    case 'slice':
      return <Slice {...props} />
    default:
      return <Paragraph {...props} />;
  }
}