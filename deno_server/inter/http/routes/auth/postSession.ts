import { AccessDenied } from "../../errors.ts";
import { createEndpoint } from "../../utils.ts";
import * as v from "valibot";

export default createEndpoint(({core}) => ({
  method: "POST",
  url: "/auth/session",
  schema: {
    body: v.required(v.object({
      login: v.string(),
      password: v.string(),
    })),
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
      throw new AccessDenied('Invalid login or password');
    }
    const session = await core.session.get({id: sessionId});
    if(!session) {
      throw new AccessDenied('Invalid login or password');
    }

    req.ctx.cookies.set('token', session.token, { httpOnly: true });
    return { status: 'ok', ...session};
  }
}));
