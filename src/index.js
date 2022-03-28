const http = require('http');
const messageController = require('./message/messageController');
const userController = require('./user/userController');
const pushController = require('./push/pushController');


require('./database/init')();

const app = require('./app');
const wss = require('./wss');

const PORT = 8080;

const server = http.createServer(app);

wss({server})
  .on('start', (srv) => console.log('[WSS] Server is listening on port:', srv.port))
  .on('connection', pushController.sendConfig)
  .on('op:greet', (self) => self.sys([
    {text: "Hello!"}, {emoji: "wave"}, {br: true},
    {text: 'You can use "/help" to get more info'}, {br: true},
    {text: 'You won\'t be able to send any messages until you login'}, {br: true},
  ], true))
  .on('op:load', messageController.load)
  .on('op:ping', (self, msg) => msg.ok())
  .on('op:restore', userController.restore)
  .on('op:typing', messageController.isTyping)
  .on('op:setupPushNotifications', pushController.setupPushNotifications)
  .on('command:help', (self, msg) => msg.ok().then(() => self.sys([
      {text: "/channel <name> - change current channel"}, {br: true},
      {text: "/name <name> - to change your name"}, {br: true},
      {text: "/login <name> <password> - login to your account"}, {br: true},
      {text: "/help - display this help"}, {br: true},
    ], true)))
  .on('command:name', userController.changeName)
  .on('command:login', userController.login)
  .on('command:channel', messageController.changeChannel)
  .on('message', messageController.handle)
  .on('broadcast:after', pushController.notifyOther)
  .start()


server.listen(PORT, () => {
  console.log('Server is listening on port:', PORT)
})

