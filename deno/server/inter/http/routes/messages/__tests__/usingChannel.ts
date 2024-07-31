import { Channel, EntityId } from "../../../../../types.ts";
import { repo } from "../../../../../infra/mod.ts";

export const usingChannel = async (
  channel: Partial<Channel>,
  fn: (channelId: EntityId) => Promise<void>,
) => {
  let channelId = channel.id;
  try {
    const c = channel.id ? await repo.channel.get({ id: channel.id }) : null;
    if (!c) {
      channelId = await repo.channel.create(channel);
    }
    if (!channelId) {
      throw new Error("Channel could not be created");
    }
    await fn(channelId);
  } finally {
    await repo.channel.remove({ id: channelId });
  }
};
