// eslint-disable-next-line import/no-unresolved
const { getMessaging } = require('firebase-admin/messaging');
const push = require('./pushService');
const { sessionRepo } = require('../database/db');

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
        appVersion: process.env.COMMIT,
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
            },
          },
          token: ses.fcmToken,
        };
        if (self.user.avatarUrl) {
          Object.assign(message, {
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
            },
          });
        }
        return getMessaging().send(message);
      } if (ses.pushSubscription) {
        return push.sendNotification(ses.pushSubscription, JSON.stringify({
          title: `Message from ${msg.user?.name || 'Guest'}`,
          description: msg.flat,
          channel: msg.channel,
        })).catch((err) => {
          if (err.status === 410) {
            return sessionRepo.update(ses.id, {
              pushSubscription: null,
            });
          }
        });
      }
    }));
  },
};
