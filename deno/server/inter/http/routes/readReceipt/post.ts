import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "POST",
    url: "/",
    public: false,
    schema: {
      body: {
        type: "object",
        required: ["messageId"],
        properties: {
          messageId: { type: "string", format: "entity-id" },
        },
      },
    },
    handler: async (req) => {
      const userId = req.state.user.id;
      const { messageId } = req.body;
      const receiptId = await core.dispatch({
        type: "readReceipt:update",
        body: { userId, messageId },
      });
      return Response.json({ id: receiptId });
    },
  });
