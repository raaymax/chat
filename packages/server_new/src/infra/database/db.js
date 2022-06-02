/* eslint-disable global-require */
const config = require('../../../../../chat.config');

if (config.databaseUrl.startsWith('mongodb')) {
  module.exports = require('./mongo');
} else {
  throw new Error('Missing database driver');
}
