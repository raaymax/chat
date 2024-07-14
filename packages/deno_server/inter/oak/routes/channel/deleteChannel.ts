import { createEndpoint } from "../../utils.ts";
import * as v from "valibot";

export default createEndpoint(({core}) => ({
  method: "DELETE",
  url: "/channels/:channelId",
  auth: true,
  schema: {
    params: v.required(v.object({
      channelId: v.string(),
    })),
    response: {
      200: {
        contentType: "application/json",
      },
    },
  },
  handler: async (req) => {
    await core.dispatch({
      type: "channel:remove",
      body: {
        channelId: req.params.channelId,
        userId: req.userId,
      }
    });
    return {status: 'ok'};
  }
}));
