import { Route } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";

export default (core: Core) => new Route({
  method: "DELETE",
  url: "/auth/session",
  handler: async (req, res) => {
    if(req.state.session) {
      await core.dispatch({
        type: 'session:remove',
        body: {
          sessionId: req.state.session.id,
        }
      });
    }
    req.cookies.delete('token');
    res.send({ status: 'ok' });
  }
});
