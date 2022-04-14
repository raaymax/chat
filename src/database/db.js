/* eslint-disable global-require */

if (process.env.DATABASE_URL.startsWith('mongodb')) {
  module.exports = require('./mongo');
} else {
  module.exports = require('./postgres');
}
