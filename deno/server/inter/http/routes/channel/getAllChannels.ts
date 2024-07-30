import { Core } from "../../../../core/mod.ts";
import { Route, Res } from '@planigale/planigale';

export default (core: Core) => new Route({
  method: "GET",
  url: "/channels",
  handler: async (req) => {
    const channels = await core.channel.getAll({ userId: req.state.user.id });
    return Res.json(channels);
  }
});
