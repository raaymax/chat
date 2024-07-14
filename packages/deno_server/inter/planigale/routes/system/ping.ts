import { Route } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";

export default (_core: Core) => new Route({
  method: "GET",
  url: "/ping",
  auth: false,
  handler: async (_req, res) => {
    res.send({ status: 'ok' });
  }
});

