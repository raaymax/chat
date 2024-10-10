import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "POST",
    url: "/",
    schema: {
      body: {
        type: "object",
        required: ["channelId", "clientId", "action"],
        properties: {
          parentId: { type: "string", format: "entity-id" },
          channelId: { type: "string", format: "entity-id" },
          clientId: { type: "string" },
          appId: { type: "string" },
          action: { type: "string" },
          payload: {},
        },
      },
    },
    handler: async (req) => {
      const userId = req.state.user.id;

      await core.dispatch({
        type: "message:interaction",
        body: {
          ...req.body,
          userId,
        },
      });

      return Res.empty();
    },
  });
