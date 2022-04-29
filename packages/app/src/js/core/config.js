/* eslint-disable no-undef */

let set = null;
const config = new Promise((resolve) => { set = resolve; });

const getConfig = () => config;
const setConfig = (c) => set(c);

export const initConfig = (client) => {
  client.on('op:setConfig', handleConfig)
  Object.assign(client, { getConfig });
};

function handleConfig(client, msg) {
  if (APP_VERSION) {
    // eslint-disable-next-line no-console
    console.log('version check: ', APP_VERSION, msg.op.config.appVersion);
    if (msg.op.config.appVersion !== APP_VERSION) {
      if (Capacitor.isNativePlatform()) {
        setTimeout(() => insertMessage({
          id: 'version',
          priv: true,
          createdAt: new Date(),
          user: {
            name: 'System',
          },
          message: [
            { line: { bold: { text: 'Your Quack app version is outdated!!' } } },
            { line: { text: `Your app version: ${APP_VERSION}` } },
            { line: { text: `Required version ${msg.op.config.appVersion}` } },
            { line: { text: 'Please update' } },
          ],
        }), 1000);
      } else {
        setTimeout(() => window.location.reload(true), 5000);
        insertMessage({
          id: 'version',
          priv: true,
          createdAt: new Date(),
          user: {
            name: 'System',
          },
          message: [
            { line: { bold: { text: 'Your Quack version is outdated!!' } } },
            { line: { text: 'Please reload the page to update' } },
          ],
        });
        return;
      }
    }
  }
  setConfig(msg.op.config);
  client.emit('config:ready', msg.op.config);
}
