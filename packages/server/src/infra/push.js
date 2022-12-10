const { getMessaging } = require('./firebase');
const db = require('./database');
const conf = require('../../../../chat.config');

const PushService = {
  push: async (message) => {
    try {
      return getMessaging().sendMulticast(message);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }
  },
  send: async (msg) => {
    if (process.env.OFFLINE) return;
    if (!msg.message) return Promise.resolve();
    const channel = await db.channel.get({ cid: msg.channel });
    if (!channel) return;
    const user = await db.user.get({ id: msg.userId });
    if (!user) return;
    const users = await db.user.getAll({ 
      id: channel.users.filter((id) => id !== msg.userId),
    });

    const tokens = [...new Set(users.map((u) => Object.keys(u.notifications || {})).flat())]
    if (tokens.length === 0) return Promise.resolve();
    const message = {
      tokens,
      topic: 'messages',
      data: {
        channel: msg.channel,
      },
      notification: {
        title: `${user?.name || 'Guest'} on ${msg.channel}`,
        body: msg.flat,
      },
      android: {
        priority: 'high',
        collapse_key: msg.userId,
        notification: {
          ...(user.avatarUrl ? { imageUrl: user.avatarUrl } : {}),
          channel_id: 'default',
          icon: 'stock_ticker_update',
          color: '#7e55c3',
          sound: 'https://chat.codecat.io/assets/sound.mp3',
        },
      },
      webpush: {
        headers: {
          image: user.avatarUrl,
          Urgency: 'high',
        },
        fcm_options: {
          link: `${conf.serverWebUrl}/#${msg.channel}`,
        },
        notification: {
          silent: false,
          vibrate: [200, 100, 200],
          badge: user.avatarUrl,
          image: user.avatarUrl,
        },
      },
    };
    return PushService.push(message);
  },
};

module.exports = PushService;
