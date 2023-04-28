/* eslint-disable global-require */
const { createRepositories } = require('@quack/repositories');
const config = require('../../../../chat.config');

if (config.databaseUrl.startsWith('mongodb')) {
  module.exports = createRepositories(config.databaseUrl);
} else {
  throw new Error('Missing database driver');
}
