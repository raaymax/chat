const repo = require('../../infra/repositories');
const conf = require('../../../../../chat.config');

const omitUndefined = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([, v]) => v !== undefined),
);

const PushService = {
  send: async (msg, { push = {} } = {}) => {
    if (!msg.message) return Promise.resolve();
    const channel = await repo.channel.get({ id: msg.channelId });
    if (!channel) return;
    const user = await repo.user.get({ id: msg.userId });
    if (!user) return;
    const users = await repo.user.getAll({
      ids: channel.users.filter((id) => id !== msg.userId),
    });

    const tokens = [...new Set(users.map((u) => Object.keys(u.notifications || {})).flat())];

    if (tokens.length === 0) return;
    const message = {
      tokens,
      topic: 'messages',
      data: omitUndefined({
        channelId: channel.id,
        parentId: msg.parentId,
        messageId: msg.id,
        createdAt: new Date(msg.createdAt).toISOString(),
      }),
      notification: {
        title: `${user?.name || 'Guest'} on ${channel.name}`,
        body: msg.flat,
      },
      android: {
        priority: 'high',
        notification: {
          ...(user.avatarUrl ? { imageUrl: user.avatarUrl } : {}),
          channel_id: 'default',
          icon: 'stock_ticker_update',
          color: '#7e55c3',
          sound: 'https://chat.codecat.io/assets/sound.mp3',
          tag: channel.id,
        },
      },
      webpush: {
        headers: {
          image: user.avatarUrl,
          Urgency: 'high',
        },
        fcm_options: {
          link: `${conf.serverWebUrl}/#/${channel.name}`,
        },
        notification: {
          silent: false,
          vibrate: [200, 100, 200],
          badge: user.avatarUrl,
          image: user.avatarUrl,
        },
      },
    };
    return push(message);
  },
};

module.exports = PushService;
