import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "POST",
    url: "/read-receipts",
    public: false,
    schema: {
      params: {
        type: "object",
        properties: {
          parentId: { type: "string" },
        },
      },
      body: {
        type: "object",
        required: ["messageId"],
        properties: {
          messageId: { type: "string" },
        },
      },
    },
    handler: async (req) => {
      const userId = req.state.user.id;
      const parentId = req.params?.parentId;
      const messageId = req.body.messageId;
      console.log({
        userId,
        parentId,
        messageId,
      });
      const receiptId = await core.dispatch({
        type: "readReceipt:update",
        body: { userId, parentId, messageId },
      });
      return Response.json({ id: receiptId });
    },
  });
