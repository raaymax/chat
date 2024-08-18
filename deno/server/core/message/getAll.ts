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
      offset: v.optional(v.number()),
      order: v.optional(v.union([v.literal(1), v.literal(-1)])),
    })
  })),
}, async ({userId, query: msg}, {repo}) => {
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
    }, {offset: msg.offset, limit: msg.limit, order: msg.order ?? (msg.after ? 1 : -1) });

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
