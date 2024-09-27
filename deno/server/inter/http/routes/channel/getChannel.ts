import { Core } from "../../../../core/mod.ts";
import { Res, ResourceNotFound, Route } from "@planigale/planigale";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/:channelId",
    schema: {
      params: {
        type: "object",
        required: ["channelId"],
        properties: {
          channelId: {
            type: "string",
            minLength: 24,
            maxLength: 24,
            pattern: "^[0-9a-fA-F]{24}$",
          },
        },
      },
    },
    handler: async (req) => {
      const channel = await core.channel.get({
        id: req.params.channelId,
        userId: req.state.user.id,
      });
      if (!channel) {
        throw new ResourceNotFound("Channel not found");
      }
      return Res.json(channel);
    },
  });
