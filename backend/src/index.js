const WebSocket = require('ws');
const {v4: uuid} = require('uuid');
const initUsers = require('./user/user');
const {handleCommands} = require('./commands');
const {handleOps} = require('./ops');
const {handleMessages} = require('./messages');

require('./database/init')();

const App = require('./app');

const sendWelcomeMessage = (srv, self) => {
  return self.send(srv.sysMsg([
    {text: "Hello!"}, {emoji: "wave"}, {br: true},
    {text: 'You can use "/help" to get more info'}, {br: true},
    {text: 'You won\'t be able to send any messages until you login'}, {br: true},
  ], true));
}

App({port: 8000})
  .on('start', (srv) => console.log('Server is listening on port:', srv.port))
  .on('start', async (srv) => {
    srv.users = require('./user/user')
  })
  .on('connection', sendWelcomeMessage)
  .on('op', handleOps)
  .on('command', handleCommands)
  .on('message', handleMessages)
  .start()

