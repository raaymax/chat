const push = require('./pushService');

module.exports = {
  setNotifications: async (self, msg) => {
    const {op} = msg;
    if(!op.subscription) return msg.error({code: "MISSING_SUBSCRIPTION"});
    if(!self.user) return msg.error({code: "ACCESS_DENIED"});
    self.sub = op.subscription;
    msg.ok();

    //pushRepository.insert({userId, self.user.id, })
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

  notify: async (self, msg) => {
    if(self.sub && msg.notify && msg.user.id !== self.user.id) {
      push.sendNotification(self.sub, JSON.stringify({
        title: 'Message from '+ (msg.user?.name || 'Guest'),
        description: msg.flat,
      }))
    }
  }
}
