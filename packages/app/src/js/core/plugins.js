/* eslint-disable no-undef */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const registry = {};
const plugins = {
  register: (slot, data) => {
    if (typeof data === 'function') {
      data = data(window.client);
    }
    registry[slot] = registry[slot] || [];
    [data].flat().forEach((d) => registry[slot].push(d));
  },

  get: (slot) => registry[slot] || [],
};

window.Chat = plugins;

if (PLUGIN_LIST) {
  PLUGIN_LIST.forEach((plugin) => {
    document.head.appendChild(Object.assign(document.createElement('script'), {
      src: `/plugins/${plugin}/plugin.js`,
    }));
  });
}

module.exports = plugins;
