import { Route } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";

export default (_core: Core) => new Route({
  method: "GET",
  auth: false,
  url: "/auth/session",
  handler: async (req, res) => {
    if (req.state.session) {
      res.send(req.state.session);
    } else {
      res.send({ status: 'no-session' });
    }
  }
});
