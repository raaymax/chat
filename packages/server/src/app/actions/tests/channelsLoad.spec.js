const assert = require('assert');
const api = require('./api');

describe('channels:load', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ name: 'Mateusz' });
  });

  it('should return list of channels', async () => {
    const { res, data: channels } = await api.sendMessage({ type: 'channels:load' }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');
    const main = channels.find((c) => c.name === 'main');
    assert.ok(main);
    assert.equal(main.type, 'channel');
    assert.equal(main.name, 'main');
    assert.equal(main.cid, 'main');
    const mateusz = channels.find((c) => c.name === 'Mateusz');
    assert.ok(mateusz);
    assert.equal(mateusz.type, 'channel');
    assert.equal(mateusz.name, 'Mateusz');
    const melisa = channels.find((c) => c.name === 'Melisa');
    assert(!melisa);
  });
});
