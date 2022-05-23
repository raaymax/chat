const Joi = require('joi');
const http = require('http');

const messageController = require('./message/messageController');
const userController = require('./user/userController');
const pushController = require('./push/pushController');
const fileController = require('./file/fileController');
const channelsController = require('./channel/channelController');
const Errors = require('./errors');
const commands = require('./commands');

const app = require('./app');
const wss = require('./wss');

const server = http.createServer(app);

const sessionSchema = Joi.object({
  id: Joi.string().required(),
  secret: Joi.string().required(),
});

wss({ server })
  // eslint-disable-next-line no-console
  .on('start', (srv) => console.log('[WSS] Server is listening on port:', srv.port))
  .on('connection', pushController.sendConfig)
  .on('greet', sendGreet)
  .on('load', messageController.load)
  .on('initUpload', fileController.initUpload)
  .on('finalizeUpload', fileController.finalizeUpload)
  .on('initDownload', fileController.initDownload)
  .on('ping', (self, msg) => msg.ok())
  .on('restore', restore)
  .on('typing', messageController.isTyping)
  .on('setupPushNotifications', pushController.setupPushNotifications)
  .on('setupFcm', pushController.setupFcm)
  .on('channels', channelsController.getAll)
  .on('createChannel', channelsController.create)
  .on('removeChannel', channelsController.remove)
  .on('removeMessage', messageController.remove)
  .on('message', messageController.handle)
  .on('command', commands)
  .on('*', unknownOp)
  .on('broadcast:after', pushController.notifyOther)
  .start();

async function restore(self, msg) {
  const ret = sessionSchema.validate(msg.session);
  if (ret.error) {
    return msg.error(Errors.ValidationError(ret.error.message));
  }
  return userController.restore(self, msg);
}

async function sendGreet(self, msg) {
  await self.sys([
    { text: 'Hello!' }, { emoji: 'wave' }, { br: true },
    { text: 'You can use "/help" to get more info' }, { br: true },
    { text: 'You won\'t be able to send any messages until you login' }, { br: true },
  ], { priv: true, seqId: msg.seqId, msgId: 'greet' });
  await msg.ok();
}

function unknownOp(_self, msg) {
  msg.error(Errors.UnknownOp(msg.type));
}
module.exports = server;
