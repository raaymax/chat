import * as v from "valibot";
import { repo } from "../../infra/mod.ts";
import { createCommand } from "../command.ts";
import { Id } from "../types.ts";

export default createCommand({
  type: "channel:remove",
  body: v.object({
    channelId: Id,
    userId: Id,
  }),
}, async ({ channelId, userId }) => {
  await repo.channel.remove({ id: channelId, userId });
});
