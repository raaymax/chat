/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const config = require('../../../../config');

const registry = {};
const plugins = {
  register: (slot, data) => {
    if (!data) return;
    registry[slot] = registry[slot] || [];
    [data].flat().forEach((d) => registry[slot].push(d));
  },

  get: (slot) => registry[slot] || [],
};

if (config.plugins) {
  config.plugins.forEach((plugin) => {
    const p = require(path.resolve('../../plugins/', plugin));
    Object.keys(p).forEach((key) => {
      plugins.register(key, p[key]);
    });
  });
}

module.exports = plugins;
