import { EntityId } from "../../../types.ts";

export class JoinCommand {
  static commandName = "join";
  static prompt = "";
  static description = "Join the current channel";

  static async execute(data: any, core: any) {
    const channel = await core.channel.access({
      userId: data.userId,
      id: data.context.channelId,
    });

    await core.dispatch({
      type: "channel:join",
      body: {
        channelId: channel.id,
        userIds: [data.userId],
      },
    });

    core.bus.direct(data.userId, {
      type: "message",
      clientId: `sys:${Math.random().toString(10)}`,
      channelId: data.context.channelId,
      flat: "You have joined the channel",
      message: { text: "You have joined the channel" },
      createdAt: new Date().toISOString(),
    });
  }
}
