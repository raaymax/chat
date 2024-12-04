import { CommandBody } from "../params.ts";

export class MainCommand {
  static commandName = "main";
  static prompt = "";
  static description = "Sets current channel as main channel";

  static async execute(data: CommandBody, core: any) {
    const channel = await core.repo.channel.get({ id: data.context.channelId });
    if (!channel) {
      return;
    }
    await core.repo.user.update({ id: data.userId }, {
      mainChannelId: data.context.channelId,
    });
  }
}
