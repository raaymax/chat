import { Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/",
    public: false,
    handler: async (req) => {
      const userId = req.state.user.id;
      const channelId = req.params.channelId;
      const parentId = req.params?.parentId;
      const results = await core.readReceipt.getChannel({
        channelId,
        userId,
        parentId,
      });
      return Response.json(results);
    },
  });
