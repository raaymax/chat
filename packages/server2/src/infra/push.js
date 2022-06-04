const { getMessaging } = require('./firebase');
const { sessionRepo, channelRepo } = require('./database');
const conf = require('../../../../chat.config');

module.exports = {
  send: async (msg) => {
     // FIXME: feature disable or separate config for testing?
    if (process.env.NODE_ENV === 'test') return Promise.resolve();
    if (!msg.message) return Promise.resolve();
    const channel = await channelRepo.get({ cid: msg.channel });
    const sess = await sessionRepo.getByUsers({
      userId: channel.users.filter((user) => user.toHexString() !== self.user.id),
    });
    const tokens = Object.keys(
      sess
        .map((s) => s.fcmToken)
        .reduce((acc, token) => ({ ...acc, [token]: true }), {}),
    ).filter((k) => !!k);

    if (tokens.length === 0) return Promise.resolve();
    // eslint-disable-next-line array-callback-return
    const message = {
      tokens,
      data: {
        channel: msg.channel,
      },
      notification: {
        title: `${msg.user?.name || 'Guest'} on ${msg.channel}`,
        body: msg.flat,
      },
      android: {
        collapse_key: msg.user.id,
        notification: {
          ...(self.user.avatarUrl ? { imageUrl: self.user.avatarUrl } : {}),
          icon: 'stock_ticker_update',
          color: '#7e55c3',
          sound: 'https://chat.codecat.io/assets/sound.mp3',
        },
      },
      apns: {
        payload: {
          aps: {
            'mutable-content': 1,
          },
        },
        fcm_options: {
          image: self.user.avatarUrl,
        },
      },
      webpush: {
        headers: {
          image: self.user.avatarUrl,
        },
        fcm_options: {
          link: `${conf.serverWebUrl}/#${msg.channel}`,
        },
        notification: {
          silent: false,
          vibrate: [200, 100, 200],
          badge: self.user.avatarUrl,
          image: self.user.avatarUrl,
        },
      },
    };
    return getMessaging().sendMulticast(message);
  },
};
