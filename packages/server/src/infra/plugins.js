/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const config = require('../../../../config');

const registry = {};
const plugins = {
  register: (slot, data) => {
    registry[slot] = registry[slot] || [];
    [data].flat().forEach((d) => registry[slot].push(d));
  },

  get: (slot) => registry[slot] || [],
};

if (config.plugins) {
  config.plugins.forEach((plugin) => {
    const p = require(path.resolve('../../plugins/', plugin));
    plugins.register('commands', p.commands);
  });
}

module.exports = plugins;
