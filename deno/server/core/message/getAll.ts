
import { repo } from "../../infra/mod.ts";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import * as v from "valibot";
import { AccessDenied, ResourceNotFound } from "../errors.ts";

export default createQuery({
  type: "message:getAll",
  body: v.required(v.object({
    userId: Id,
    query: v.object({
      channelId: Id,
      parentId: v.optional(Id),
      pinned: v.optional(v.boolean()),
      before: v.optional(v.pipe(v.string(), v.transform((v) => new Date(v)))),
      after: v.optional(v.pipe(v.string(), v.transform((v) => new Date(v)))),
      limit: v.optional(v.number()),
    })
  })),
}, async ({userId, query: msg}) => {
    const { channelId, parentId } = msg;

    if (!channelId) throw new ResourceNotFound("Channel not found");

    //if (!await ChannelHelper.haveAccess(userId, channelId)) {
    //  throw new AccessDenied();
    //}

    const msgs = await repo.message.getAll({
      channelId,
      parentId,
      before: msg.before,
      after: msg.after,
      ...(msg.pinned ? { pinned: msg.pinned } : {}),
    }, { limit: msg.limit, order: msg.after ? 1 : -1 });

    if (msg.after) msgs.reverse();
    
    if (parentId) {
      const parent = await repo.message.get({
        id: parentId,
        channelId,
      });
      return [parent, ...msgs];
    }
    return msgs;
});

