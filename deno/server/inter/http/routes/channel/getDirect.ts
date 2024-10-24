import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";
import { ChannelType } from "../../../../types.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/direct/:userId",
    schema: {
      params: {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string", format: "entity-id" },
        },
      },
    },
    handler: async (req) => {
      const channel = await core.channel.getDirect({
        userId: req.state.user.id,
        targetUserId: req.params.userId,
      });

      return Res.json(channel);
    },
  });
