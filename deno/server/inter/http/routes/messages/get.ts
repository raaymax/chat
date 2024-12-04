import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/:messageId",
    schema: {
      params: {
        type: "object",
        required: ["messageId"],
        properties: {
          messageId: { type: "string", format: "entity-id" },
        },
      },
    },
    handler: async (req) => {
      const message = await core.message.get({
        userId: req.state.user.id,
        messageId: req.params.messageId,
      });
      return Res.json(message);
    },
  });
