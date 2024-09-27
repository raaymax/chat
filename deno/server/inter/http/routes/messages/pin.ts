import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "PUT",
    url: "/:messageId/pin",
    schema: {
      params: {
        type: "object",
        required: ["messageId"],
        properties: {
          messageId: { type: "string", format: "entity-id" },
        },
      },
      body: {
        type: "object",
        properties: {
          pinned: { type: "boolean" },
        },
      },
    },
    handler: async (req) => {
      const userId = req.state.user.id;

      await core.dispatch({
        type: "message:pin",
        body: {
          id: req.params.messageId,
          userId,
          pinned: req.body.pinned,
        },
      });
      return Res.empty();
    },
  });
