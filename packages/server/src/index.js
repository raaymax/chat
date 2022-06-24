const server = require('./server');
const config = require('../../../chat.config');

// eslint-disable-next-line no-console
server.listen(config.port, () => console.log('Server listening on port:', config.port));
