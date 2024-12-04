import { client } from './client';

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    client.emit('win.visible', {});
  }
});


export * from './client';
