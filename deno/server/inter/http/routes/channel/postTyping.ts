import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";
import { ChannelType } from "../../../../types.ts";

export default (core: Core) =>
  new Route({
    method: "POST",
    url: "/:channelId/typing",
    schema: {
      params: {
        type: "object",
        required: ["channelId"],
        properties: {
          channelId: { type: "string", format: "entity-id" },
        },
      },
      body: {
        type: "object",
        properties: {
          parentId: { type: "string", format: "entity-id" },
        },
      },
    },
    handler: async (req) => {
      await core.dispatch({
        type: "channel:user:typing",
        body: {
          userId: req.state.user.id,
          channelId: req.params.channelId,
          parentId: req.body.parentId,
        },
      });
      return Res.empty();
    },
  });
