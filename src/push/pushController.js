const push = require('./pushService');
const sessionRepository = require('../user/sessionRepository');

module.exports = {
  setupPushNotifications: async (self, msg) => {
    const {op} = msg;
    if(!op.subscription) return msg.error({code: "MISSING_SUBSCRIPTION"});
    if(!self.user) return msg.error({code: "ACCESS_DENIED"});
    self.sub = op.subscription;
    await sessionRepository.update(self.session.id, {
      pushSubscription: op.subscription,
    });

    msg.ok();
  },

  sendConfig: async (self) => {
    return self.send({
      op: {
        type: 'setConfig',
        config: {
          applicationServerKey: process.env.VAPID_PUBLIC
        }
      }
    });
  },

  notifyOther: async (self, msg) => {
    if(!msg.message) return;
    const sess = await sessionRepository.getOther({userId: self.user.id});
    return Promise.all(sess.map(ses => {
      if(!ses.pushSubscription) return;
      return push.sendNotification(ses.pushSubscription, JSON.stringify({
        title: 'Message from '+ (msg.user?.name || 'Guest'),
        description: msg.flat,
        channel: msg.channel,
      })).catch(err => {
        if(err.status === 410) {
          return sessionRepository.update(ses.id, {
            pushSubscription: null
          });
        }
      })
    }))
  },

  notify: async (self, msg) => {
    if(self.sub && msg.notify && msg.user.id !== self.user.id) {
      push.sendNotification(self.sub, JSON.stringify({
        title: 'Message from '+ (msg.user?.name || 'Guest'),
        description: msg.flat,
      }))
    }
  }
}
