import * as v from "valibot";
import { createQuery } from "../query.ts";
import { Id } from "../types.ts";
import { ResourceNotFound } from "../errors.ts";

export default createQuery({
  type: "readReceipt:getChannel",
  body: v.object({
    userId: Id,
    channelId: Id,
    parentId: v.optional(Id),
  }),
}, async ({ userId: _userId, channelId, parentId }, { repo }) => {
  const channel = await repo.channel.get({ id: channelId });
  if (!channel) {
    throw new ResourceNotFound("Channel not found");
  }
  // TODO: Permission check

  return await repo.badge.getAll({ channelId: channel.id, parentId });
});
