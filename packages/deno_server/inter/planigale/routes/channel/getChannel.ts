import { Core } from "../../../../core/mod.ts";
import { Route, ResourceNotFound } from '@codecat/planigale';

export default (core: Core) => new Route({
  method: "GET",
  url: "/channels/:channelId",
  auth: true,
  schema: {
    params: {
      type: 'object',
      required: ['channelId'],
      properties: {
        channelId: {type: 'string'},
      }
    }
  },
  handler: async (req, res) => {
    const channel = await core.channel.get({ id: req.params.channelId, userId: req.state.user.id });
    if(!channel) {
      throw new ResourceNotFound('Channel not found');
    }
    res.send(channel);
  }
});
