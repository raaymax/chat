import type { Core } from '../../../core/mod.ts'
import { Middleware } from '@codecat/planigale';

export const authMiddleware = (core: Core): Middleware => async (req, res, next) => {
  let token = await req.cookies.get('token');
  if (!token) {
    const bearer = req.headers.authorization || '';
    token = bearer.split(/[\s]+/)[1];
  }
  if (token) {
    req.state.token = token;
    req.state.session = await core.session.get({ token });
    if (!req.state.session) {
      req.cookies.delete('token');
      return await auth(req, res, next);
    }
    req.state.user = await core.user.get({ id: req.state.session.userId });
  }
  await auth(req, res, next);
};

export const auth: Middleware = async (req, res, next) => {
  const authEnabled = req.route?.definition.auth ?? true;
  if (!authEnabled || req.state.user) {
    return await next();
  }
  res.status = 401;
  res.send({ message: 'Unauthorized' });
};

