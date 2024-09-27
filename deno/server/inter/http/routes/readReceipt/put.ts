import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "PUT",
    url: "/channels/:channelId/read-receipts",
    public: false,
    schema: {
      params: {
        type: "object",
        required: ["channelId"],
        properties: {
          channelId: { type: "string" },
          parentId: { type: "string" },
        },
      },
      body: {
        type: 'object',
        required: ['messageId'],
        properties: {
          messageId: { type: 'string' },
        },
      },
    },
    handler: async (req) => {
      const userId = req.state.user.id;
      const channelId = req.params.channelId;
      const parentId = req.params?.parentId;
      const messageId = req.body.messageId;
      const receiptId = await core.dispatch({
        type: "readReceipt:put",
        body: { userId, channelId, parentId, messageId },
      });
      return Response.json({id: receiptId});
    },
  });
