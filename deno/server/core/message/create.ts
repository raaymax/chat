import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr } from "../types.ts";
import { bus } from "../bus.ts";
import { ResourceNotFound } from "../errors.ts";

export default createCommand({
  type: "message:create",
  body: v.required(
    v.object({
      userId: Id,
      message: v.any(),
      channelId: Id,
      parentId: v.optional(Id),
      flat: v.string(),
      pinned: v.optional(v.boolean()),
      clientId: v.string(),
      emojiOnly: v.optional(v.boolean(), false),
      debug: v.optional(v.string()),
      links: v.optional(v.array(v.string()), []),
      mentions: v.optional(v.array(v.string()), []),
      attachments: v.optional(
        v.array(v.object({
          id: v.string(),
          fileName: v.string(),
          contentType: v.optional(v.string(), "application/octet-stream"),
        })),
        [],
      ),
    }),
    ["userId", "message", "channelId", "clientId", "flat"],
  ),
}, async (msg, { repo, services }) => {
  const channel = await repo.channel.get({
    id: msg.channelId,
    userId: msg.userId,
  });
  if (!channel) {
    throw new ResourceNotFound("Channel not found");
  }

  async function createMessage(msg: any) {
    const data = Object.fromEntries(
      Object.entries(msg).filter(([, v]) => v !== undefined),
    );
    let id;
    let dup = false;
    try {
      id = await repo.message.create(data);
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
      dup = true;
      const message = await repo.message.get({
        clientId: msg.clientId,
      });
      if (message) {
        id = message.id;
      }
    }
    return { id, dup };
  }

  const { id, dup } = await createMessage({
    message: msg.message,
    flat: msg.flat,
    pinned: msg.pinned,
    channelId: channel.id,
    parentId: msg.parentId,
    channel: channel.cid,
    clientId: msg.clientId,
    emojiOnly: msg.emojiOnly,
    userId: msg.userId,
    links: msg.links,
    mentions: msg.mentions,
    attachments: msg.attachments?.map((file: any) => ({
      id: file.id,
      fileName: file.fileName,
      contentType: file.contentType,
    })),
    createdAt: new Date(),
  });

  const usersToAdd = msg.mentions.filter((m: any) =>
    !channel.users.includes(m)
  );
  if (usersToAdd.length) {
    const group = [...new Set([...channel.users, ...usersToAdd])];
    //await repo.channel.update({ id: channel.id }, { users: group });
    const c = await repo.channel.get({ id: msg.channelId });
    bus.group(group, { type: "channel", ...c });
  }

  if (id && msg.parentId) {
    await repo.message.updateThread({
      id,
      parentId: msg.parentId,
      userId: msg.userId,
    });
    const parent = await repo.message.get({ id: msg.parentId });
    bus.group(channel.users, { type: "message", ...parent });
  }

  const created = await repo.message.get({ id });
  if (!dup) {
    bus.group(channel.users, { type: "message", ...created });
    //await services.notifications.send(created, res);
  }
  if (id) {
    await services.badge.messageSent({
      channelId: channel.id,
      parentId: msg.parentId,
      messageId: id,
      userId: msg.userId,
    });
  }
  return id; //{ id, duplicate: dup };
  /*
    if (msg.links?.length) {
      services.link.addPreview(
        { messageId: id, links: msg.links },
        { bus: res.bus },
      );
    }
    */
});
