// NOTE: after another db wipe, this line MUST be here! 
process.env.DATABASE_URL = 'mongodb://chat:chat@localhost:27017/tests?authSource=admin';

const request = require('supertest');
const server = require('../src/server');
const PushService = require('../src/infra/push');

PushService.push = async () => {};

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

// require('./socket.spec');
require('./socket-io.spec');
