const assert = require('assert');

module.exports = (agent) => {
  describe('session', () => {
    it('user not logged in', async () => {
      await agent
        .get('/session')
        .expect(200, { status: 'no-session' });
    });

    it('login failed', async () => {
      await agent
        .post('/session')
        .send({ login: 'mateusz', password: '321' })
        .expect(401, { status: 'nok' });
    });

    it('login', async () => {
      await agent
        .post('/session')
        .send({ login: 'mateusz', password: '123' })
        .expect(200)
        .expect((res) => {
          assert.equal(res.body.status, 'ok');
        });
    });

    it('login should send userId instead of user');

    it('user logged in', async () => {
      await agent
        .get('/session')
        .expect(200)
        .expect((res) => {
          assert.equal(res.body.status, 'ok');
        });
    });

    it('user logout', async () => {
      await agent
        .delete('/session')
        .expect(204);
      await agent
        .get('/session')
        .expect(200, { status: 'no-session' });
    });
  });
};
