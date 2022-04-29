const {
  match,
  partial,
  anyString,
} = require('../helpers');

module.exports = (sys) => {
  describe('channels', () => {
    it('should respond with error if not logged in', async () => {
      match(await sys.req({ op: { type: 'channels' } }), [
        partial({ resp: { status: 'error', data: { errorCode: 'ACCESS_DENIED' } } }),
      ]);
    });
    it('should respond with list of named channels', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      match(await sys.req({ op: { type: 'channels' } }), [
        partial({
          channel: {
            name: 'main',
          },
        }),
        partial({ resp: { status: 'ok' } }),
      ]);
    });
    it('should create new channel', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      match(await sys.req({ op: { type: 'createChannel', name: 'test' } }), [
        {
          channel: {
            id: anyString,
            name: 'test',
          },
        },
        { resp: {status: 'ok', data: {id: anyString()}}},
      ]);
      match(await sys.req({ op: { type: 'channels' } }), [
        {
          channel: {
            name: 'main',
          },
        },
        {
          channel: {
            name: 'test',
          },
        },
        { resp: { status: 'ok' } },
      ]);
    });
    it('should remove channel', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      match(await sys.req({ op: { type: 'removeChannel', name: 'test' } }), [
        { resp: {status: 'ok', data: {id: anyString()}}},
      ]);
      match(await sys.req({ op: { type: 'channels' } }), [
        partial({
          channel: {
            name: 'main',
          },
        }),
        partial({ resp: { status: 'ok' } }),
      ]);
    });
  });
};
