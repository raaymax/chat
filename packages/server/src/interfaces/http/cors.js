const config = require('@quack/config');

module.exports = {
  credentials: true,
  origin: config.cors,
  allowedHeaders: ['Content-Type', 'Cookie', 'Authorization'],
};
