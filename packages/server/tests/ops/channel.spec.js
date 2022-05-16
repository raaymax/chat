const { match } = require('../helpers');

module.exports = (sys) => {
  describe('channels', () => {
    it('should respond with error if not logged in', async () => {
      match(await sys.req({ op: { type: 'channels' } }), [
        { resp: { status: 'error', data: { errorCode: 'ACCESS_DENIED' } } },
      ]);
    });
    it('should respond with list of named channels', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      match(await sys.req({ op: { type: 'channels' } }), [
        {
          op: {
            type: 'addChannel',
            channel: {
              name: 'main',
            },
          },
        },
        {
          op: {
            type: 'addChannel',
            channel: {
              name: 'Mateusz',
            },
          },
        },
        { resp: { status: 'ok' } },
      ]);
    });
  });
};
