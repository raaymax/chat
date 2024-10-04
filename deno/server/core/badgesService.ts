import { Repository } from "../infra/mod.ts";
import { Badge, EntityId } from "../types.ts";
import { Bus } from "./bus.ts";

class BadgesService {
  core: any;

  constructor(core: { repo: Repository; bus: Bus }) {
    this.core = core;
  }

  get repo(): Repository {
    return this.core.repo;
  }

  get bus(): Bus {
    return this.core.bus;
  }

  async upsert({
    channelId,
    parentId,
    userId,
    lastRead,
    ...data
  }: {
    channelId: EntityId;
    parentId?: EntityId;
    userId: EntityId;
    lastRead: Date;
    lastMessageId: EntityId;
    count?: number;
  }) {
    const progress = await this.repo.badge.get({ channelId, parentId, userId });
    if (progress && progress.lastRead > lastRead) return;

    if (!progress) {
      await this.repo.badge.create({
        count: 0,
        channelId,
        parentId,
        userId,
        lastRead,
        ...data,
      });
    } else {
      await this.repo.badge.update({ id: progress.id }, {
        lastRead,
        ...data,
      });
    }
  }

  async messageSent(
    {
      channelId,
      parentId,
      messageId,
      userId,
    }: {
      channelId: EntityId;
      parentId?: EntityId;
      messageId: EntityId;
      userId: EntityId;
    },
  ) {
    const channel = await this.repo.channel.get({ id: channelId });
    if (!channel) {
      // eslint-disable-next-line no-console
      console.debug("read-receipt update: channel not found", channelId);
      return;
    }
    const message = await this.repo.message.get({ id: messageId });
    if (!message) {
      // eslint-disable-next-line no-console
      console.debug("read-receipt update:  message not found", messageId);
      return;
    }
    await this.repo.badge.increment({ channelId, parentId });
    const other = await this.repo.badge.getAll({ channelId, parentId });
    other.filter((badge: Badge) => badge.userId !== userId).forEach(
      (badge: Badge) => {
        this.bus.direct(badge.userId, { type: "badge", ...badge });
      },
    );
    await this.upsert({
      userId,
      channelId,
      parentId,
      lastMessageId: messageId,
      lastRead: message.createdAt,
      count: 0,
    });
    const badge = await this.repo.badge.get({ channelId, parentId, userId });
    this.bus.group(channel.users, { type: "badge", ...badge });
  }
}

export default BadgesService;
