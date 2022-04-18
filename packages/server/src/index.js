const admin = require('firebase-admin');
const server = require('./server');

const PORT = 8080;

admin.initializeApp({});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is listening on port:', PORT);
});
