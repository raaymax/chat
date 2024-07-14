import { Core } from "../../../../core/mod.ts";
import { Route } from '@codecat/planigale';

export default (core: Core) => new Route({
  method: "DELETE",
  url: "/channels/:channelId",
  auth: true,
  schema: {
    params: {
      type: 'object',
      required: ['channelId'],
      properties: {
        channelId: {type: 'string'},
      }
    },
  },
  handler: async (req, res) => {
    await core.dispatch({
      type: "channel:remove",
      body: {
        channelId: req.params.channelId,
        userId: req.state.user.id,
      }
    });
    res.send({status: 'ok'});
  }
})
