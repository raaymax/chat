import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "DELETE",
    url: "/:channelId",
    schema: {
      params: {
        type: "object",
        required: ["channelId"],
        properties: {
          channelId: { type: "string" },
        },
      },
    },
    handler: async (req) => {
      await core.dispatch({
        type: "channel:remove",
        body: {
          channelId: req.params.channelId,
          userId: req.state.user.id,
        },
      });
      return Res.empty();
    },
  });
