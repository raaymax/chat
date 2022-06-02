const crypto = require('crypto');
const WebSocket = require('ws');
const { v4: uuid } = require('uuid');

const sessions = {};
const connections = {};

module.exports = {
  getBySession,
  getByConnection,
  removeBySession,
};

// missing broadcast:after
const broadcast = (msg) => {
  msg._raw = JSON.stringify(msg);
  return Promise.all(Object.values(connections).map((con) => {
    if (!con.user) return;
    return con.send({
      ...msg,
      senderId: con.id,
    });
  }));
};

function getByConnection(ws, connectionToken, send) {
  const existing = connections[connectionToken];
  if (!existing) return null;

  return Object.assign(existing, {
    ws,
    channel: 'main',
    send,
    broadcast,
  });
}

function getBySession(session) {
  sessions[session.sid] = sessions[session.sid] || createSession(session);
  return sessions[session.sid];
}

function removeBySession(session) {
  if (session.sid) {
    const self = sessions[session.sid];
    delete sessions[self.sid];
    delete connections[self.connectionToken];
  }
}

function createSession(data) {
  //load user id from session
  const id = uuid();
  const self = {
    sid: id,
    connectionToken: crypto.randomBytes(16).toString('hex'),
    ...data,
  };
  sessions[id] = self;
  connections[self.connectionToken] = self;
  return self;
}
