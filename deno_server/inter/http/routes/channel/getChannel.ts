import { ChannelType } from "../../../../types.ts";
import { createEndpoint } from "../../utils.ts";
import * as v from "valibot";
import { ResourceNotFound } from "../../errors.ts";

export default createEndpoint(({core}) => ({
  method: "GET",
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
    const channel = await core.channel.get({id: req.params.channelId, userId: req.userId});
    if(!channel) {
      throw new ResourceNotFound('Channel not found');
    }
    return channel;
  }
}));
