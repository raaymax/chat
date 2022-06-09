const Joi = require('joi');
const http = require('http');

const messageController = require('./message/messageController');
const userController = require('./user/userController');
const pushController = require('./push/pushController');
const fileController = require('./file/fileController');
const channelsController = require('./channel/channelController');
const Errors = require('./errors');
const commands = require('./commands');
const msgFactory = require('./message/messageFactory');

const app = require('./app');
const wss = require('./wss');
const connections = require('./connections');

const server = http.createServer(app);

const sessionSchema = Joi.object({
  id: Joi.string().required(),
  secret: Joi.string().required(),
});

wss({ server })
  // eslint-disable-next-line no-console
  .on('start', () => console.log('[WSS] Server is listening on port:'))
  .on('auth', auth)
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

async function auth(self, msg) {
  const { user, session } = connections.getByConnection(self.ws, msg.token); // rename to activate?
  msg.ok({ user, session }); // filter user data
}

async function restore(self, msg) {
  const ret = sessionSchema.validate(msg.session);
  if (ret.error) {
    return msg.error(Errors.ValidationError(ret.error.message));
  }
  return userController.restore(self, msg);
}

async function sendGreet(self, msg) {
  await self.send(msgFactory.createSystemMessage({
    id: 'greet',
    seqId: msg.seqId,
    message: [
      { text: 'Hello!' }, { emoji: 'wave' }, { br: true },
      { text: 'You can use "/help" to get more info' }, { br: true },
      { text: 'You won\'t be able to send any messages until you login' }, { br: true },
    ],
  }));
  await msg.ok();
}

async function unknownOp(_self, msg) {
  if (msg) msg.error(Errors.UnknownOp(msg.type));
}
module.exports = server;
