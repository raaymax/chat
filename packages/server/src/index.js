const config = require('@quack/config');
const server = require('./server');
require('./plugins');

// eslint-disable-next-line no-console
server.listen(config.port, () => console.log('Server listening on port:', config.port));
