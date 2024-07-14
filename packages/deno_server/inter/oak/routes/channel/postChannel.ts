import { ChannelType } from "../../../../types.ts";
import { createEndpoint } from "../../utils.ts";
import * as v from "valibot";

export default createEndpoint(({core}) => ({
  method: "POST",
  url: "/channels",
  auth: true,
  schema: {
    body: v.required(v.object({
      name: v.string(),
      channelType: v.optional(v.enum_(ChannelType), ChannelType.PUBLIC),
    }), ['name']),
    response: {
      200: {
        contentType: "application/json",
      },
    },
  },
  handler: async (req) => {
    if (!req.body) return 
    const channelId = await core.dispatch({
      type: "channel:create",
      body: {
        userId: req.userId,
        name: req.body.name,
        channelType: req.body.channelType,
      }
    });
    const channel = await core.channel.get({id: channelId, userId: req.userId});
    return channel;
  }
}));
