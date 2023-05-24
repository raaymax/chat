const assert = require('assert');
const config = require('@quack/config');
const api = require('../../actions/tests/api');

describe('/avatar', () => {
  let user;

  before(async () => {
    user = await api.repo.user.get({ login: 'admin' });
  });

  it('should change users avatar and infor about change', async () => {
    const channel = await api.repo.channel.get({ name: 'main' });
    const { res, data: [updatedUser] } = await api.sendMessage({
      type: 'command:execute',
      name: 'avatar',
      args: [],
      context: {
        channelId: channel.id,
      },
      attachments: [{ id: '123', fileName: 'avatar.jpg' }],
    }, { userId: user.id });
    assert.equal(res.type, 'response');
    assert.equal(res.status, 'ok');

    const state = await api.repo.user.get({ id: user.id });
    assert.equal(state.avatarFileId, '123');

    assert.equal(updatedUser.type, 'user');
    assert.equal(updatedUser.avatarUrl, `${config.imagesUrl}/123`);
  });
});
