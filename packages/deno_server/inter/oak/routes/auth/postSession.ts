
import { AccessDenied } from "../../errors.ts";
import { Router } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";


export default (core: Core) => {
  const mod = new Router();

  mod.route({
    method: "POST",
    url: "/auth/session",
    schema: {
      body: {
        type: "object",
        properties: {
          login: { type: "string" },
          password: { type: "string" },
        },
      },
    },
    handler: async (req, res) => {
      if (!req.body) return 
      const sessionId = await core.dispatch({
        type: "session:create",
        body: {
          login: req.body.login,
          password: req.body.password,
        }
      });
      if(!sessionId) {
        throw new AccessDenied('Invalid login or password');
      }
      const session = await core.session.get({id: sessionId});
      if(!session) {
        throw new AccessDenied('Invalid login or password');
      }

      req.cookies.set('token', session.token, { httpOnly: true });
      res.send({ status: 'ok', ...session});
    }
  });

  return mod;
};

