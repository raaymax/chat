import * as v from "valibot";
import { createCommand } from "../command.ts";
import { Id, IdArr, vMessageBody } from "../types.ts";
import { NotOwner, ResourceNotFound } from "../errors.ts";

export default createCommand({
  type: "message:update",
  body: v.object({
    id: Id,
    userId: Id,
    data: v.object({
      flat: v.optional(v.string()),
      pinned: v.optional(v.boolean()),
      message: v.optional(vMessageBody),
      emojiOnly: v.optional(v.boolean()),
      links: v.optional(v.array(v.string())),
      mentions: v.optional(v.array(v.string())),
      attachments: v.optional(
        v.array(v.object({
          id: v.string(),
          fileName: v.string(),
          contentType: v.optional(v.string(), "application/octet-stream"),
        })),
      ),
    }),
  }),
}, async (msg, core) => {
  const { repo } = core;
  const message = await repo.message.get({ id: msg.id });
  if (!message) {
    throw new ResourceNotFound("Message not found");
  }
  if (message.userId.neq(msg.userId)) {
    throw new NotOwner();
  }
  await repo.message.update({ id: msg.id }, msg.data);

  await core.events.dispatch({
    type: "message:updated",
    payload: await repo.message.getR({ id: msg.id }),
  });
});
