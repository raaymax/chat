const { getMessaging } = require('../infra/firebase');
const { sessionRepo } = require('../database/db');
const { channelRepo } = require('../database/db');
const pack = require('../../package.json');
const conf = require('../../../../chat.config');

module.exports = (self, msg) => {
    if (!msg.fcmToken) return msg.error({ code: 'MISSING_SUBSCRIPTION' });
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    self.fcmToken = msg.fcmToken;
    await sessionRepo.update(self.session.id, {
      fcmToken: msg.fcmToken,
    });

    return msg.ok();
  
}
