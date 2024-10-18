import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id } from "../types.ts";
import { ResourceNotFound } from "../errors.ts";

export default createCommand({
  type: "message:pin",
  body: v.object({
    id: Id,
    userId: Id,
    pinned: v.optional(v.boolean()),
  }),
}, async (msg, core) => {
  const { repo } = core;
  const message = await repo.message.get({ id: msg.id });
  if (!message) {
    throw new ResourceNotFound("Message not found");
  }
  await core.channel.access({ id: message.channelId, userId: msg.userId })
    .internal();
  await repo.message.update({ id: msg.id }, { pinned: msg.pinned });
});
