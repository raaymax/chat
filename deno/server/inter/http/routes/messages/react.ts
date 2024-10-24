import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "PUT",
    url: "/:messageId/react",
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
        required: ["reaction"],
        properties: {
          reaction: { type: "string", format: "emoji-shortname" },
        },
      },
    },
    handler: async (req) => {
      await core.dispatch({
        type: "message:react",
        body: {
          id: req.params.messageId,
          userId: req.state.user.id,
          reaction: req.body.reaction,
        },
      });
      return Res.empty();
    },
  });
