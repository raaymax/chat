const admin = require('firebase-admin');
const server = require('./server');
const serviceAccount = require('../../../../codecat-quack.json');

const PORT = 8080;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is listening on port:', PORT);
});
