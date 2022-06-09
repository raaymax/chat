const request = require('supertest');
const server = require('../src/server');

require('./helpers.spec');

describe('http', () => {
  const agent = request.agent(server);

  it('ping', async () => {
    await agent
      .get('/ping')
      .expect(204);
  });

  require('./http/session.spec')(agent);
  require('./http/files.spec')(agent);
});

require('./socket.spec');
require('./client/client.spec');
