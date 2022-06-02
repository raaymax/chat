const server = require('../src/server');
const request = require('supertest');
const assert = require('assert');

require('./helpers.spec');

describe('server', () => {
  const agent = request.agent(server);
  
  it('ping', async () => {
    await agent
      .get('/ping')
      .expect(204);
  })

  it('user not logged in', async () => {
    await agent
      .get('/session')
      .expect(200, {status: 'NO_SESSION'})
  })

  it('login failed', async () => {
    await agent
      .post('/session')
      .send({login: 'mateusz', password: '321'})
      .expect(401, {status: 'NOT_AUTHORIZED'})
  })

  it('login', async () => {
    await agent
      .post('/session')
      .send({login: 'mateusz', password: '123'})
      .expect(200)
      .expect(res => {
        assert(res.body.status, 'OK');
      })
  })

  it('user logged in', async () => {
    await agent
      .get('/session')
      .expect(200)
      .expect(res => {
        assert(res.body.status, 'OK');
      })
  })

  require('./socket.spec');
});
