import * as v from "valibot";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import { ChannelType, EntityId } from "../../types.ts";

export default createQuery({
  type: "channel:direct:get",
  body: v.required(v.object({
    userId: Id,
    targetUserId: Id,
  })),
}, async (query, { repo }) => {
  const users = EntityId.unique([query.userId, query.targetUserId])
  const channel = await repo.channel.get({
    channelType: ChannelType.DIRECT,
    users,
    usersCount: users.length,
  })
  return channel;
});
