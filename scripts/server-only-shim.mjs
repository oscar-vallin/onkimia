// Shim for `server-only` when running scripts outside the Next.js runtime.
// tsx resolves bare specifiers via --import, so we intercept the module here.
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register(
  `data:text/javascript,
    export async function resolve(spec, ctx, next) {
      if (spec === 'server-only') {
        return { shortCircuit: true, url: 'data:text/javascript,' };
      }
      return next(spec, ctx);
    }
  `,
  pathToFileURL('./')
);
