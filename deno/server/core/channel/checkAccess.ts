import * as v from "valibot";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import { AccessDenied, ResourceNotFound } from "../errors.ts";
import { ChannelType } from "../../types.ts";

export default createQuery({
  type: "channel:permissions:check",
  body: v.required(v.object({
    userId: Id,
    id: Id,
  })),
}, async ({ id, userId }, { repo }) => {
  const channel = await repo.channel.get({ id });
  if (!channel) throw new ResourceNotFound("Channel not found");
  if (
    channel.channelType !== ChannelType.PUBLIC &&
    !channel.users.some((u) => u.eq(userId))
  ) {
    throw new AccessDenied();
  }
  return channel;
});
