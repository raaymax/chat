const pushService = require('./pushService');

module.exports = {
  setNotifications: async (self, msg) => {
    const {op} = msg;
    if(!op.subscription) return;
    if(!self.user) return;
    self.sub = op.subscription;

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
    if(self.sub && msg.notify && msg.senderId !== self.id) {
      push.sendNotification(self.sub, JSON.stringify({
        title: 'Message from '+ (msg.user?.name || 'Guest'),
        description: msg.flat,
      }))
    }
  }
}
