/* eslint-disable no-undef */

let set = null;
const config = new Promise((resolve) => { set = resolve; });

const getConfig = () => config;
const setConfig = (c) => set(c);

export const initConfig = (client) => {
  client.on('config', handleConfig);
  client.req({type: 'config'});
  Object.assign(client, { getConfig });

  function handleConfig(msg) {
    if (APP_VERSION) {
      // eslint-disable-next-line no-console
      console.log('version check: ', APP_VERSION, msg.appVersion);
      if (msg.appVersion !== APP_VERSION) {
        if (Capacitor.isNativePlatform()) {
          setTimeout(() => client.emit('message', {
            id: 'version',
            priv: true,
            createdAt: new Date(),
            user: {
              name: 'System',
            },
            message: [
              { line: { bold: { text: 'Your Quack app version is outdated!!' } } },
              { line: { text: `Your app version: ${APP_VERSION}` } },
              { line: { text: `Required version ${msg.config.appVersion}` } },
              { line: { text: 'Please update' } },
            ],
          }), 1000);
        } else {
          // setTimeout(() => window.location.reload(true), 5000);
          client.emit('message', {
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
    setConfig(msg.config);
    client.emit('config:ready', msg.config);
  }
};
