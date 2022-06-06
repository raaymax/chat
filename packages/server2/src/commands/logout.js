const { userRepo } = require('../database/db');
const service = require('./userService');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');


module.exports = async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    await service.sessionDestroy(self.session);
    await self.op({ type: 'rmSession' }, msg.seqId);
    self.user = null;
    self.session = null;
    self.author = 'Guest'; // FIXME: Do I really need this?
    msg.ok({});
}
