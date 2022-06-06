const server = require('../src/server');
const request = require('supertest');

require('./helpers.spec');

describe('http', () => {
  const agent = request.agent(server);

  it('ping', async () => {
    await agent
      .get('/ping')
      .expect(204);
  })
  
  require('./http/session.spec')(agent);
  require('./http/files.spec')(agent);
});

require('./socket.spec');
