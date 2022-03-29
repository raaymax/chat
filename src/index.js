const server = require('./server');

const PORT = 8080;

server.listen(PORT, () => {
  console.log('Server is listening on port:', PORT)
})

