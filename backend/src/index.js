const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const wss = new WebSocket.Server({ port: 8000 });

const connections = {};

const users = {
  melisa: {id: "7ed5c52c-35f8-4a27-929d-ff5eb1a74924", password: "123", name: "Melisa"},
  mateusz: {id: "c3875674-61f1-4793-a558-a733293f3527", password: "123", name: "Mateusz"},
}

const broadcast = (msg) => {
  Object.values(connections).forEach(con => { 
    if (con.user && con.ws.readyState === WebSocket.OPEN) {
      con.ws.send(msg.toString())
    }
  });
}

const handleCommands = (self, msg) => {
  const {args} = msg.command;
  switch(msg.command.name) {
    case 'name': 
      const prev = self.author;
      self.author = args[0];
      msg.author = args[0];
      return sysBroadcast(`User ${prev} changed name to ${args[0]}`);
    case 'help':
      return self.ws.send(sysMsg([
        {text: "/name <name> - to change your name"}, {br: true},
        {text: "/login <name> <password> - login to your account"}, {br: true},
        {text: "/help - display this help"}, {br: true},
      ], true));
    case 'login':
      const user = users[args[0]];
      if(user.password !== args[1]){
        return self.ws.send(sysMsg([
          {text: "Login failed"}, {br: true},
        ], true));
      }
      self.user = user;
      self.author = user.name;
      return self.ws.send(sysMsg([
        {text: "Login successfull"}, {br: true},
        {text: `Welcome ${user.name}`}, {br: true},
      ], true));
  }
}
const sysBroadcast = (text) => {
  return broadcast(sysMsg([{text}]));
}
const sysMsg = (data, private = false) => {
  return JSON.stringify({
    id: uuid(),
    createdAt: new Date().toISOString(), 
    author: "System", 
    private,
    message: data,
  });
}

const sendWelcomeMessage = (ws) => {
  return ws.send(JSON.stringify({
    createdAt: new Date().toISOString(), 
    author: "System", 
    private: true,
    message: [
      {text: "Hello!"}, {emoji: "wave"}, {br: true},
      {text: 'You can use "/help" to get more info'}, {br: true},
      {text: 'You won\'t be able to send any messages until you login'}, {br: true},
    ],
  }));
}

wss.on('connection', (ws) => {
  const id = uuid();
  const self = connections[id] = {ws, author: 'Unknown'};
  console.log("Yey a connection!");
  sendWelcomeMessage(ws);

  ws.on('message', raw => {
    try {
      const msg = JSON.parse(raw);
      console.log('msg', JSON.stringify(msg, null, 4));
      msg.id = uuid();
      msg.createdAt = new Date().toISOString();
      msg.author = self.author;
      if(msg.command){
        return handleCommands(self, msg);
      }else if(msg.message) {
        console.log('broadcast');
        broadcast(JSON.stringify(msg));
      }
    } catch(err) {
      console.error(err);
    }
  })

  ws.on('close', () => {
    delete connections[id];
  });
});
