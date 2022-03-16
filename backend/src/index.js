const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const wss = new WebSocket.Server({ port: 8000 });

const connections = {};

const broadcast = (msg) => {
  Object.values(connections).forEach(con => {
    if (con.ws.readyState === WebSocket.OPEN) {
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
      return self.ws.send(JSON.stringify({
        author: 'System',
        createdAt: new Date().toISOString(),
        private: true,
        message: [
          {text: "/name <name> - to change your name"}, {br: true},
          {text: "/help - display this help"}, {br: true},
        ]
      }));
  }
}
const sysBroadcast = (text) => {
  return broadcast(JSON.stringify({
    id: uuid(),
    createdAt: new Date().toISOString(), 
    author: "System", 
    message: [{text}],
  }));
}

const sendWelcomeMessage = (ws) => {
  return ws.send(JSON.stringify({
    createdAt: new Date().toISOString(), 
    author: "System", 
    private: true,
    message: [{text: "Hello! " + new Date().toISOString()}],
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
