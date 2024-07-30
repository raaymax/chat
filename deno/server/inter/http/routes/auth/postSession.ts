import { AccessDenied } from "../../errors.ts";
import { Route, Res} from '@planigale/planigale';
import { Core } from "../../../../core/mod.ts";


export default (core: Core) => new Route({
  public: true,
  method: "POST",
  url: "/auth/session",
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
  handler: async (req) => {
    if (!req.body) return Res.json({ status: 'error', message: 'Invalid request' }, { status: 400 });
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
    const res = Res.json({ status: 'ok', ...session});
    res.cookies.set('token', session.token, { httpOnly: true });
    return res;
  }
});

