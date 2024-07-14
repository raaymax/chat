import { Core } from "../../../../core/mod.ts";
import { Route } from '@codecat/planigale';

export default (core: Core) => new Route({
  method: "GET",
  url: "/channels",
  handler: async (req, res) => {
    const channels = await core.channel.getAll({ userId: req.state.user.id });
    res.send(channels);
  }
});
