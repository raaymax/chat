const Joi = require('joi');
const http = require('http');

const messageController = require('./message/messageController');
const userController = require('./user/userController');
const pushController = require('./push/pushController');
const fileController = require('./file/fileController');
const channelsController = require('./channel/channelController');
const aiController = require('./ai/aiController');
const Errors = require('./errors');

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
    ], { priv: true, seqId: msg.seqId, msgId: 'greet' });
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
  .on('op:channels', channelsController.getAll)
  .on('op:createChannel', channelsController.create)
  .on('op:removeChannel', channelsController.remove)
  .on('op:*', unknownOp)
  .on('command:help', (self, msg) => self.sys([
    { text: '/channel <name> - change current channel' }, { br: true },
    { text: '/join - join current channel' }, { br: true },
    { text: '/leave - leave current channel' }, { br: true },

    { text: '/login <name> <password> - login to your account' }, { br: true },
    { text: '/logout - logout from your account' }, { br: true },
    { text: '/me - display user info' }, { br: true },

    { text: '/name <name> - to change your name' }, { br: true },
    { text: '/avatar <url> - to change your avatar' }, { br: true },

    { text: '/ai <question> - ask openai GPT-3' }, { br: true },

    { text: '/help - display this help' }, { br: true },
  ], { priv: true, seqId: msg.seqId, msgId: 'help' }).then(() => msg.ok()))
  .on('command:name', userController.changeName)
  .on('command:avatar', userController.changeAvatar)
  .on('command:login', userController.login)
  .on('command:channel', channelsController.changeChannel)
  .on('command:ai', aiController.createCompletion)
  .on('command:join', channelsController.join)
  .on('command:leave', channelsController.leave)
  .on('command:logout', userController.logout)
  .on('command:me', userController.me)
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
