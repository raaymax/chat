
import { Id } from "../types.ts";
import { createQuery } from "../query.ts";
import * as v from "valibot";
import { AccessDenied, ResourceNotFound } from "../errors.ts";

export default createQuery({
  type: "message:get",
  body: v.required(v.object({
    userId: Id,
    messageId: Id,
  })),
}, async ({userId, messageId}, {repo}) => {

    //if (!channelId) throw new ResourceNotFound("Channel not found");

    //if (!await ChannelHelper.haveAccess(userId, channelId)) {
    //  throw new AccessDenied();
    //}

    const msg = await repo.message.get({
      id: messageId,
    });

    return msg;
});

