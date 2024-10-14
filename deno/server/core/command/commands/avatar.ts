import type { Core } from "../../core.ts";
import { CommandBody } from "../params.ts";

export class AvatarCommand {
  static commandName = "avatar";

  static prompt = "[image attachment]";

  static description = "Set your avatar";

  static validate(data: any) {
    if (!data.attachments || data.attachments.length === 0) {
      throw new Error("missing attachment image");
    }
    if (!data.attachments[0].contentType.match(/^image\//)) {
      throw new Error("invalid attachment type, expected image");
    }
  }

  static async execute(data: CommandBody, core: Core) {
    AvatarCommand.validate(data);
    const { attachments: [{ id }] } = data;
    await core.repo.user.update({ id: data.userId }, { avatarFileId: id });
    const user = await core.repo.user.getR({ id: data.userId });
    core.bus.broadcast({
      type: "user",
      id: user.id,
      name: user.name,
      avatarFileId: user.avatarFileId,
    });
  }
}
