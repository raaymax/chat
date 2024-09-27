import * as v from "valibot";
import { createCommand } from "../command.ts";
import { hash, verify } from "@ts-rex/bcrypt";
import { ResourceNotFound } from "../errors.ts";
import { Id } from "../types.ts";

export default createCommand({
  type: "readReceipt:update",
  body: v.object({
    userId: Id,
    messageId: Id,
  }),
}, async ({ userId, messageId}, {repo, bus}) => {

    const message = await repo.message.get({ id: messageId });
    if (!message) {
      throw new ResourceNotFound("Message not found");
    }
    const parentId = message.parentId;
    const channelId = message.channelId;
    const channel = await repo.channel.get({ id: message.channelId });
    if (!channel) {
      throw new ResourceNotFound("Channel not found");
    }
    // FIXME: Permission check
    //
    //
    const data = {
      lastMessageId: message.id,
      lastRead: message.createdAt,
      count: await repo.message.count({
        after: new Date(new Date(message.createdAt).getTime() + 1),
        channelId: message.channelId,
        parentId,
      }),
    }

    const lastRead = message.createdAt;
    const progress = await repo.badge.get({ channelId, parentId, userId });
    if (progress && progress.lastRead > lastRead) return;

    if (!progress) {
      await repo.badge.create({
        channelId, parentId, userId, ...data,
      });
    } else {
      await repo.badge.update({ id: progress.id }, data);
    }

    const myProgress = await repo.badge.get({ channelId, parentId, userId });
    bus.group(channel.users, { type: 'badge', ...myProgress });
    return myProgress?.id;
});
