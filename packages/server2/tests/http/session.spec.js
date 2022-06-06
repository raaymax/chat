const assert = require('assert');

module.exports = agent => {
  describe('session', () => { 
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
          assert.equal(res.body.status, 'OK');
        })
    })

    it('user logged in', async () => {
      await agent
        .get('/session')
        .expect(200)
        .expect(res => {
          assert.equal(res.body.status, 'OK');
        })
    })
  });
}
