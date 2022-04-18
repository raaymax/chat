const admin = require('firebase-admin');
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
    return Promise.all(sess.map((ses) => {
      if (ses.fcmToken) {
        const message = {
          data: {
            title: `Message from ${msg.user?.name || 'Guest'}`,
            description: msg.flat,
            channel: msg.channel,
          },
          token: ses.fcmToken,
        };
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
