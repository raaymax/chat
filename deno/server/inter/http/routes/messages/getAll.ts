import { Route, Res } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/",
    schema: {
      params: {
        type: "object",
        required: ["channelId"],
        properties: {
          channelId: { type: "string" },
          parentId: { type: "string" },
        },
      },
      query: {
        type: "object",
        properties: {
          pinned: { type: "string" },
          before: { type: "string" },
          after: { type: "string" },
          limit: { type: "number" },
        },
      }
    },
    handler: async (req) => {
      const messages = await core.message.getAll({
        userId: req.state.user.id,
        query: {
          channelId: req.params.channelId,
          parentId: req.params.parentId,
          pinned: req.query.pinned,
          before: req.query.before,
          after: req.query.after,
          limit: req.query.limit,
        }
      });
      return Res.json(messages);
    },
  });

/*

const Joi = require('joi');
const repo = require('../../../infra/repositories');
const { MissingChannel, AccessDenied } = require('../../common/errors');
const ChannelHelper = require('../../common/channel');

module.exports = {
  type: 'message:getAll',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      parentId: Joi.string().optional().allow(null).default(null),
      pinned: Joi.string().optional(),
      before: Joi.string().optional(),
      after: Joi.string().optional(),
      limit: Joi.number().optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    const { channelId, parentId } = msg;

    if (!channelId) throw MissingChannel();

    if (!await ChannelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    if (parentId) {
      const parent = await repo.message.get({
        id: parentId,
        channelId,
      });
      res.send({ type: 'message', ...parent, parentId });
    }

    const msgs = await repo.message.getAll({
      channelId,
      parentId,
      before: msg.before,
      after: msg.after,
      ...(msg.pinned ? { pinned: msg.pinned } : {}),
    }, { limit: msg.limit, order: msg.after ? 1 : -1 });

    if (msg.after) msgs.reverse();

    msgs.forEach((m) => res.send({ type: 'message', ...m }));
    res.ok({ count: msgs.length });
  },
};

const Joi = require('joi');
const repo = require('../../../infra/repositories');
const { AccessDenied } = require('../../common/errors');
const channelHelper = require('../../common/channel');

module.exports = {
  type: 'message:search',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      text: Joi.string().required(),
      limit: Joi.number().optional().default(100),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    const { channelId } = msg;

    if (!await channelHelper.haveAccess(req.userId, channelId)) {
      throw AccessDenied();
    }
    const msgs = await repo.message.getAll({
      search: msg.text,
      channelId,
      before: msg.before,
    }, { limit: msg.limit, order: -1 });

    msgs.forEach((m) => res.send({ type: 'search', ...m }));
    res.ok({ count: msgs.length });
  },
};

*/
