// eslint-disable-next-line import/no-unresolved
const { getMessaging } = require('firebase-admin/messaging');
const { sessionRepo } = require('../database/db');
const pack = require('../../package.json');

module.exports = {
  setupPushNotifications: async (self, msg) => {
    const { op } = msg;
    if (!op.subscription) return msg.error({ code: 'MISSING_SUBSCRIPTION' });
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    self.sub = op.subscription;
    await sessionRepo.update(self.session.id, {
      pushSubscription: op.subscription,
    });

    return msg.ok();
  },
  setupFcm: async (self, msg) => {
    const { op } = msg;
    if (!op.fcmToken) return msg.error({ code: 'MISSING_SUBSCRIPTION' });
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    self.fcmToken = op.fcmToken;
    await sessionRepo.update(self.session.id, {
      fcmToken: op.fcmToken,
    });

    return msg.ok();
  },

  sendConfig: async (self) => self.send({
    op: {
      type: 'setConfig',
      config: {
        appVersion: pack.version,
        applicationServerKey: process.env.VAPID_PUBLIC,
      },
    },
  }),

  notifyOther: async (self, msg) => {
    if (!msg.message) return Promise.resolve();
    const sess = await sessionRepo.getOther({ userId: self.user.id });
    // eslint-disable-next-line array-callback-return
    return Promise.all(sess.map((ses) => {
      if (ses.fcmToken) {
        const message = {
          token: ses.fcmToken,
          data: {
            channel: msg.channel,
          },
          notification: {
            title: `Message from ${msg.user?.name || 'Guest'}`,
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
              link: process.env.SERVER_URL,
            },
            notification: {
              silent: false,
              vibrate: [200, 100, 200],
              badge: self.user.avatarUrl,
              image: self.user.avatarUrl,
            },
          },
        };
        return getMessaging().send(message);
      }
    }));
  },
};
