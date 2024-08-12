import * as v from "valibot";
import { createQuery } from "../query.ts";
import { Id } from "../types.ts";
import pack from "../../../../package.json" with { type: "json" };
import config from "@quack/config";
import { ResourceNotFound } from "../errors.ts";

export default createQuery({
  type: "user:config",
  body: v.object({
    id: Id,
  }),
}, async (query, {repo}) => {
  const user = await repo.user.get(query);
  if (!user) {
    throw new ResourceNotFound("User not found");
  }
  const channel = await repo.channel.get({ cid: user.id.toString() });
  return {
    appVersion: pack.version,
    mainChannelId: user?.mainChannelId ?? channel?.id,
    vapidPublicKey: config.vapid.publicKey,
  };
});

