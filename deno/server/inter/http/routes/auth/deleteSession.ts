import { Route, Res } from '@planigale/planigale';
import { Core } from "../../../../core/mod.ts";

export default (core: Core) => new Route({
  method: "DELETE",
  url: "/auth/session",
  handler: async (req) => {
    if(req.state.session) {
      await core.dispatch({
        type: 'session:remove',
        body: {
          sessionId: req.state.session.id,
        }
      });
    }
    const res = Res.json({ status: 'ok' });
    req.cookies.delete('token');
    return res;
  }
});
