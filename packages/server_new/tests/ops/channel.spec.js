const { match } = require('../helpers');

module.exports = (sys) => {
  describe('channels', () => {
    it('should respond with error if not logged in', async () => {
      match(await sys.req({ type: 'channels' }), [
        { type: 'response', status: 'error', data: { errorCode: 'ACCESS_DENIED' } },
      ]);
    });
    it('should respond with list of named channels', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'channels' }), [
        {
          type: 'addChannel',
          channel: {
            name: 'main',
          },
        },
        {
          type: 'addChannel',
          channel: {
            name: 'Mateusz',
          },
        },
        { type: 'response', status: 'ok' },
      ]);
    });
  });
};
