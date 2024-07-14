import { AccessDenied } from "../../errors.ts";
import { Route } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";


export default (core: Core) => new Route({
  method: "POST",
  url: "/auth/session",
  auth: false,
  schema: {
    body: {
      type: "object",
      required: ["login", "password"],
      properties: {
        login: { type: "string" },
        password: { type: "string" },
      },
    },
  },
  handler: async (req, res) => {
    if (!req.body) return;
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

    res.cookies.set('token', session.token, { httpOnly: true });
    res.send({ status: 'ok', ...session});
  }
});

