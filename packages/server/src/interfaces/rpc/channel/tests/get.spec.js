const assert = require('assert');
const api = require('../../tests/api');

describe('channel:get', () => {
  let main;
  let user;

  before(async () => {
    main = await api.repo.channel.get({ name: 'main' });
    user = await api.repo.user.get({ name: 'Admin' });
  });
  after(async () => {
    await api.repo.close();
  });

  it('should return specific channel', async () => {
    const { res, data: [channel] } = await api.sendMessage({ type: 'channel:get', id: main.id }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    assert.equal(channel.name, 'main');
  });
});
