import { Core } from "../../../../core/mod.ts";
import { Route } from '@codecat/planigale';
import { ChannelType } from "../../../../types.ts";

export default (core: Core) => new Route({
  method: "POST",
  url: "/channels",
  auth: true,
  schema: {
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: {type: 'string'},
        channelType: {
          type: 'string',
          enum: [ChannelType.DIRECT, ChannelType.PUBLIC, ChannelType.PRIVATE],
          default: ChannelType.PUBLIC,
        },
      }
    },
  },
  handler: async (req, res) => {
    const channelId = await core.dispatch({
      type: "channel:create",
      body: {
        userId: req.state.user.id,
        name: req.body.name,
        channelType: req.body.channelType,
      }
    });
    const channel = await core.channel.get({id: channelId, userId: req.state.user.id});
    res.send(channel);
  }
});
