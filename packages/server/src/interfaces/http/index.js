const http = require('http');
const app = require('./app');

const server = http.createServer(app);
require('./ws')(server);

module.exports = server;
