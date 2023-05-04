const server = require('./server');
const config = require('../../../config');
require('./plugins');

// eslint-disable-next-line no-console
server.listen(config.port, () => console.log('Server listening on port:', config.port));
