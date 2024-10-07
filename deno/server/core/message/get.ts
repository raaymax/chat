import * as v from "valibot";
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import { AccessDenied, ResourceNotFound } from "../errors.ts";

export default createQuery({
  type: "message:get",
  body: v.required(v.object({
    userId: Id,
    messageId: Id,
  })),
}, async ({ userId, messageId }, { repo, channel }) => {
  // if (!channelId) throw new ResourceNotFound("Channel not found");

  // if (!await ChannelHelper.haveAccess(userId, channelId)) {
  //  throw new AccessDenied();
  // }

  const msg = await repo.message.get({
    id: messageId,
  });
  if (!msg) throw new ResourceNotFound("Message not found");
  await channel.access({ userId, id: msg.channelId }).internal();

  return msg;
});
