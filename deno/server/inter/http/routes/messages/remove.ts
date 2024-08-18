import { Route, Res } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "DELETE",
    url: "/:messageId",
    schema: {
      params: {
        type: "object",
        required: ["messageId"],
        properties: {
          messageId: { type: "string", format: "entity-id" },
        },
      },
    },
    handler: async (req) => {
      await core.message.remove({ userId: req.state.user.id, messageId: req.params.messageId });
      return Res.empty();
    },
  });
/*

const Joi = require('joi');
const repo = require('../../../infra/repositories');
const { MissingId, NotOwnerOfMessage, MessageNotExist } = require('../../common/errors');

module.exports = {
  type: 'message:remove',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.body;
    if (!id) throw MissingId();

    const message = await repo.message.get({ id });
    if (!message) throw MessageNotExist();

    if (req.userId !== message.userId) throw NotOwnerOfMessage();

    const channel = await repo.channel.get({ id: message.channelId });
    await repo.message.remove({ id });
    await res.group(channel.users, {
      id,
      type: 'message',
      channelId: message.channelId,
      message: [],
      user: {
        name: 'System',
      },
      notifType: 'warning',
      notif: 'Message removed',
    });
    return res.ok();
  },
};


*/