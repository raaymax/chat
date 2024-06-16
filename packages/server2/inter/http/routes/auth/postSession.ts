import { createEndpoint } from "../../utils.ts";
import * as v from "valibot";

export default createEndpoint(({core}) => ({
  method: "POST",
  url: "/auth/session",
  schema: {
    body: v.object({
      login: v.string(),
      password: v.string(),
    }),
    response: {
      200: {
        contentType: "application/json",
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
      res.send({ status: 'error', message: 'Invalid login or password' });
      return;
    }
    const session = await core.session.get({id: sessionId});
    if(!session) {
      res.send({ status: 'error', message: 'Session not found' });
      return;
    }

    req.ctx.cookies.set('token', session.token, { httpOnly: true });
    res.send({ status: 'ok', ...session});
  }
}));
