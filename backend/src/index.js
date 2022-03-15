const WebSocket = require('ws');
const {v4: uuid} = require('uuid');

const wss = new WebSocket.Server({ port: 8000 });

const connections = {};

const broadcast = (msg) => {
  Object.values(connections).forEach(con => con.ws.send(msg.toString()));
}

wss.on('connection', (ws) => {
  const id = uuid();
  const self = connections[id] = {ws, author: 'Unknown'};
  console.log("Yey a connection!");
  ws.send(JSON.stringify({author: "System", message: "Hello! " + new Date().toISOString()}));

  ws.on('message', raw => {
    const msg = JSON.parse(raw);
    console.log(msg);
    const m = msg.message.ops[0].insert.match(/^\/name (.*)\n$/);
    if(m){ 
      console.log(m);
      self.author = m[1];
    }

    msg.author = self.author;
    broadcast(JSON.stringify(msg));
  })
});
