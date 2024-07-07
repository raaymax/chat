import { Context, Next } from '../types.ts';
import type { Core } from '../../../core/mod.ts'

export const authMiddleware = (core: Core) => async (ctx: Context, next: Next) => {
  let token = await ctx.cookies.get('token');
  if (!token) {
    const bearer = ctx.request.headers.get('Authorization') || '';
    token = bearer.split(/[\s]+/)[1];
  }
  if (token) {
    ctx.state.token = token;
    ctx.state.session = await core.session.get({ token });
    if (!ctx.state.session) {
      ctx.cookies.delete('token');
      return await next();
    }
    ctx.state.user = await core.user.get({ id: ctx.state.session.userId });
  }
  await next();
};
