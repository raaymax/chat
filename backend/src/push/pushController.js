
module.exports = {
  setNotifications: async (self, msg) => {
    const {op} = msg;
    if(!op.subscription) return;
    if(!self.user) return;
    self.sub = op.subscription;
    console.log('save sub', self.sub);

    //pushRepository.insert({userId, self.user.id, })
  },
  sendConfig: async (self) => {
    return self.send({
      op: {
        type: 'set:config',
        config: {
          applicationServerKey: process.env.VAPID_PUBLIC
        }
      }
    });
  },
  notify: async (self, msg) => {
    if(msg.notify && msg.senderId !== self.id) {
      self.sendNotification({
        title: 'Message from '+ (msg.user?.name || 'Guest'),
        description: msg.flat,
      });
    }
  }
}
