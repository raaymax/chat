import { Core } from "../../../../core/mod.ts";
import { Route, ResourceNotFound, Res } from '@planigale/planigale';

export default (core: Core) => new Route({
  method: "GET",
  url: "/channels/:channelId",
  schema: {
    params: {
      type: 'object',
      required: ['channelId'],
      properties: {
        channelId: {type: 'string'},
      }
    }
  },
  handler: async (req) => {
    const channel = await core.channel.get({ id: req.params.channelId, userId: req.state.user.id });
    if(!channel) {
      throw new ResourceNotFound('Channel not found');
    }
    return Res.json(channel);
  }
});
