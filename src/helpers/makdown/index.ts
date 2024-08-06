import { Editor, Transforms } from 'slate';
import { BindingObject } from '../../vite-env';
import { binding as header } from './header';
import { binding as list } from './list';
export const bindings: BindingObject[] = [
  header,
  list
].map(binding => {
  return {
    ...binding,
    handler(ctx) {
      const line = ctx.line;
      Transforms.removeNodes(this, {
        at: line[1]
      });
      this.getModule()
      // return binding.handler.call(this, ctx);
    }
  }
})