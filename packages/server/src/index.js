const server = require('./server');

const PORT = 8080;

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server is listening on port:', PORT);
});
