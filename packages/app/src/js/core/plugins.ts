import { client } from './client';

declare global {
  const PLUGIN_LIST: string[] | undefined;
  interface Window {
    Chat: any;
  }
}

const registry: Record<string, Array<any>> = {};
const plugins = {
  register: (slot: string, data: any) => {
    if (typeof data === 'function') {
      data = data(client);
    }
    registry[slot] = registry[slot] || [];
    [data].flat().forEach((d) => registry[slot].push(d));
  },

  get: (slot: string): any => registry[slot] || [],
};

window.Chat = plugins;

if (PLUGIN_LIST) {
  PLUGIN_LIST.forEach((plugin) => {
    document.head.appendChild(Object.assign(document.createElement('script'), {
      src: `/plugins/${plugin}/plugin.js`,
    }));
  });
}

export default plugins;
