export const initStatus = (client) => {
  client.socket.on('connect', () => { client.emit('con:open', client); });
  client.socket.on('disconnect', () => { client.emit('con:close', client); });
};
