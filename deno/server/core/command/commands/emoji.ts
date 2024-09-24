
export class EmojiCommand {
  static name = "emoji";

  static validate(data: any) {
    if (!data.attachments || data.attachments.length === 0) {
      throw new Error("missing attachment image");
    }
    if (!data.attachments[0].contentType.match(/^image\//)) {
      throw new Error("invalid attachment type, expected image");
    }
    if (!data.text.trim().match(/^:?[a-zA-Z0-9_-]+:?$/)) {
      throw new Error("invalid emoji shortname, expected :shortname:");
    }
  }

  static async execute(data: any, core: any) {
    EmojiCommand.validate(data);
    const shortname = ':'+data.text.trim().replace(/^:/, '').replace(/:$/, '')+':';

    const id = await core.repo.emoji.create({
      shortname,
      fileId: data.attachments[0].id,
    });

    core.bus.broadcast({
      type: "emoji",
      ...(await core.repo.emoji.get(id)),
    })

    core.bus.direct(data.userId, {
      type: "message",
      userId: "system",
      priv: true,
      channelId: data.context.channelId,
      flat: `Emoji ${shortname} created`,
      message: { line: [
        { text: 'Emoji '}, { emoji: shortname }, { text: "created" },
      ]},
      createdAt: new Date().toISOString(),
    });
  }

}

