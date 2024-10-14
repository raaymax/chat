import { Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/",
    public: false,
    schema: {
      params: {
        type: "object",
        required: ["channelId"],
        properties: {
          channelId: { type: "string", format: "entity-id" },
          parentId: { type: "string", format: "entity-id" },
        },
      },
    },
    handler: async (req) => {
      const userId = req.state.user.id;
      const { channelId, parentId } = req.params;
      const results = await core.readReceipt.getChannel({
        channelId,
        userId,
        parentId,
      });
      return Response.json(results);
    },
  });
