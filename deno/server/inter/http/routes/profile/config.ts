import { Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/config",
    public: false,
    handler: async (req) => {
      const userId = req.state.user.id;
      const config = await core.user.getConfig({ id: userId });
      return Response.json(config);
    },
  });
