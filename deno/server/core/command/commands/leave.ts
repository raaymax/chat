import { EntityId } from "../../../types.ts";

export class LeaveCommand {
  static commandName = "leave";
  static prompt = "";
  static description = "Leave the current channel";

  static async execute(data: any, core: any) {
    const channel = await core.repo.channel.get({ id: data.context.channelId });
    if (!channel) {
      return;
    }
    const prevChannelUsers = channel.users;
    channel.users = channel.users.filter((user: EntityId) => user.neq(data.userId));
    await core.repo.channel.update({id: channel.id}, {users: channel.users});

    core.bus.group(prevChannelUsers, {
      type: "channel",
      ...channel,
    });

    core.bus.direct(data.userId, {
      type: "removeChannel",
      channelId: channel.id,
    });

    core.bus.direct(data.userId, {
      type: "message",
      id: 'sys:' + Math.random().toString(10),
      channelId: data.context.channelId,
      flat: "You have left the channel",
      message: { text: "You have left the channel" },
      createdAt: new Date().toISOString(),
    });
  }
}
