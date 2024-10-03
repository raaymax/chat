export class VersionCommand {
  static commandName = "version";

  static async execute(data: any, core: any) {
    core.bus.direct(data.userId, {
      type: "message",
      id: `sys:${Math.random().toString(10)}`,
      userId: (await core.repo.user.get({ name: "System" })).id,
      priv: true,
      message: {
        line: [
          { text: "Version: " },
          { bold: { text: "1.0.0" } },
        ],
      },
      channelId: data.context.channelId,
      createdAt: new Date().toISOString(),
    });
  }
}
