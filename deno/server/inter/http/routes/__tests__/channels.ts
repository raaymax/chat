import { Channel, EntityId } from "../../../../types.ts";
import { repo } from "../../../../infra/mod.ts";

export const usingChannel = async (
  channel: Partial<Channel>,
  fn: (channelId: string) => Promise<void>,
) => {
  let channelId = channel.id;
  try {
    const c = channel.id ? await repo.channel.get({ id: EntityId.from(channel.id) }) : null;
    if (!c) {
      channelId = await repo.channel.create(channel);
    }
    if (!channelId) {
      throw new Error("Channel could not be created");
    }
    await fn(channelId.toString());
  } finally {
    if(channelId) {
      await repo.message.removeMany({ channelId: EntityId.from(channelId) });
      await repo.channel.remove({ id: EntityId.from(channelId) });
    }
  }
};
