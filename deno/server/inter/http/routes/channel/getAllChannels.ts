import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/",
    handler: async (req) => {
      const channels = await core.channel.getAll({ userId: req.state.user.id });
      return Res.json(channels);
    },
  });
