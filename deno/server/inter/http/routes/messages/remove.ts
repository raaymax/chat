import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "DELETE",
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
      await core.dispatch({
        type: "message:remove",
        body: {
          userId: req.state.user.id,
          messageId: req.params.messageId,
        },
      });
      return Res.empty();
    },
  });
