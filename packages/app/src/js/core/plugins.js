/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const registry = {};
const plugins = {
  register: (slot, data) => {
    registry[slot] = registry[slot] || [];
    [data].flat().forEach((d) => registry[slot].push(d));
  },

  get: (slot) => registry[slot] || [],
};

window.plugins = plugins;

if (PLUGIN_LIST) {
  PLUGIN_LIST.forEach(async (plugin) => {
    console.log('plugin', plugin);
    const p = await import('@quack/plugin-' + plugin);
    console.log(p);
    Object.keys(p).forEach((key) => plugins.register(key, p[key]));
  });
}

module.exports = plugins;
