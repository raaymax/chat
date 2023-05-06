const repo = require('../../infra/repositories');
const conf = require('../../../../../config');
const tools = require('../tools');

const PushService = {
  send: async (msg, { push = {} } = {}) => {
    if (!msg.message) return Promise.resolve();
    const channel = await repo.channel.get({ id: msg.channelId });
    if (!channel) return;
    const user = await repo.user.get({ id: msg.userId });
    user.avatarUrl = tools.createImageUrl(user.avatarFileId);
    if (!user) return;
    const users = await repo.user.getAll({
      ids: channel.users.filter((id) => id !== msg.userId),
    });

    const subs = users.map((u) => Object.values(u.webPush || {})).flat();
    console.log(subs);

    const notif = {
      timeout: 10000,
      urgency: 'high',
      topic: 'messages',
      data: {
        icon: user.avatarUrl,
        channelId: channel.id,
        parentId: msg.parentId,
        messageId: msg.id,
        createdAt: new Date(msg.createdAt).toISOString(),
        title: `${user?.name || 'Guest'} on ${channel.name}`,
        body: msg.flat,
        link: `${conf.serverWebUrl}/#/${channel.name}`, // FIXME: use above ids
      },
    };

    console.log(notif);
    return push(
      subs,
      notif,
    );
  },
};

module.exports = PushService;
