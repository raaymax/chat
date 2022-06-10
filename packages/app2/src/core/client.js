import { Capacitor } from '@capacitor/core';

export function connect(bus) {
  let pingTimeout;
  const client = new WebSocket(getUri());

  const handle = (msg) => client.send(JSON.stringify(msg));
  bus.on('send', handle);

  function heartbeat() {
    clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
      bus.off('send', handle);
      bus.emit('client:closed', handle);
      client.close();
    }, 5000);
  }

  client.addEventListener('open', () => {
    bus.emit('client:open', handle);
    return heartbeat();
  });

  client.addEventListener('message', (raw) => {
    if (raw.data === 'PING') {
      return heartbeat();
    }
    bus.emit('message', raw.data);
  });
  client.addEventListener('error', (err) => bus.emit('error', err));
  client.addEventListener('close', () => clearTimeout(pingTimeout));
}

function getUri() {
  let protocol = 'ws:';
  if (document.location.protocol === 'https:') {
    protocol = 'wss:';
  }

  // eslint-disable-next-line no-nested-ternary
  return Capacitor.isNativePlatform()
    ? SERVER_URL
    : `${protocol}//${document.location.host}/ws`;
}
