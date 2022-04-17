/* eslint-disable global-require */

if (process.env.DATABASE_URL.startsWith('mongodb')) {
  module.exports = require('./mongo');
} else {
  throw new Error('Missing database driver');
}
