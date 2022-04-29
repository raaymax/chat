const Joi = require('joi');
const http = require('http');
const messageController = require('./message/messageController');
const userController = require('./user/userController');
const pushController = require('./push/pushController');
const fileController = require('./file/fileController');
const aiController = require('./ai/aiController');
const Errors = require('./errors');

require('./database/db').init();

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
  .on('op:greet', async (self, msg) => {
    await self.sys([
      { text: 'Hello!' }, { emoji: 'wave' }, { br: true },
      { text: 'You can use "/help" to get more info' }, { br: true },
      { text: 'You won\'t be able to send any messages until you login' }, { br: true },
    ], true, msg.seqId);
    await msg.ok();
  })
  .on('op:load', messageController.load)
  .on('op:initUpload', fileController.initUpload)
  .on('op:finalizeUpload', fileController.finalizeUpload)
  .on('op:initDownload', fileController.initDownload)
  .on('op:ping', (self, msg) => msg.ok())
  .on('op:restore', (srv, msg) => {
    const ret = sessionSchema.validate(msg.op.session);
    if (ret.error) {
      return msg.error(Errors.ValidationError(ret.error.message));
    }
    return userController.restore(srv, msg);
  })
  .on('op:typing', messageController.isTyping)
  .on('op:setupPushNotifications', pushController.setupPushNotifications)
  .on('op:setupFcm', pushController.setupFcm)
  .on('op:*', unknownOp)
  .on('command:help', (self, msg) => self.sys([
    { text: '/channel <name> - change current channel' }, { br: true },
    { text: '/name <name> - to change your name' }, { br: true },
    { text: '/avatar <url> - to change your avatar' }, { br: true },
    { text: '/login <name> <password> - login to your account' }, { br: true },
    { text: '/help - display this help' }, { br: true },
  ], true, msg.seqId).then(() => msg.ok()))
  .on('command:name', userController.changeName)
  .on('command:avatar', userController.changeAvatar)
  .on('command:login', userController.login)
  .on('command:channel', messageController.changeChannel)
  .on('command:ai', aiController.createCompletion)
  .on('command:*', unknownCommand)
  .on('message', messageController.handle)
  .on('broadcast:after', pushController.notifyOther)
  .start();

function unknownCommand(_self, msg) {
  msg.error(Errors.UnknownCommand(msg.command.name));
}

function unknownOp(_self, msg) {
  msg.error(Errors.UnknownOp(msg.op.type));
}
module.exports = server;
