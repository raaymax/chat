export const initStatus = (client) => {
  client.active = false;
  client.on('auth:ready', () => { client.active = true; });
  client.on('con:close', () => { client.active = false; });
};
