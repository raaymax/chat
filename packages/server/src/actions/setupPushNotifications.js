const { getMessaging } = require('../infra/firebase');
const { sessionRepo } = require('../database/db');
const { channelRepo } = require('../database/db');
const pack = require('../../package.json');
const conf = require('../../../../chat.config');

module.exports = (self, msg) => {
    if (!msg.subscription) return msg.error({ code: 'MISSING_SUBSCRIPTION' });
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    self.sub = msg.subscription;
    await sessionRepo.update(self.session.id, {
      pushSubscription: msg.subscription,
    });

    return msg.ok();
  
}
