/* eslint-disable global-require */
const { createRepositories } = require('@quack/repo');
const config = require('@quack/config');

if (config.databaseUrl.startsWith('mongodb')) {
  module.exports = createRepositories(config.databaseUrl);
} else {
  throw new Error('Missing database driver');
}
