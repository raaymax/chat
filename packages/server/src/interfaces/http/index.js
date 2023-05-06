/* eslint-disable global-require */
const http = require('http');
const endpoints = require('./http');

const server = http.createServer(endpoints);
require('./ws')(server);

module.exports = server;
