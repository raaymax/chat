const { match } = require('../helpers');

module.exports = (sys) => {
  describe('/channel <channel_name>', () => {
    it('should respond with error for not logged user', async () => {
      match(await sys.req({ command: { name: 'channel', args: ['test'] } }), [
        { resp: { status: 'error' } },
      ]);
    });
    it('should respond channel change message', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      match(await sys.req({ command: { name: 'channel', args: ['test'] } }), [
        { op: { type: 'setChannel', channel: 'test' } },
        { resp: { status: 'ok' } },
      ]);
    });
    it('should deny access to private channels', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      match(await sys.req({ command: { name: 'channel', args: ['6255a4156c28443c92c26d7e'] } }), [
        { resp: { status: 'error' } },
      ]);
    });
  });
  describe('/join', () => {
    it('should add channel to list', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      await sys.req({ command: { name: 'channel', args: ['test'] } });
      match(await sys.req({ command: { name: 'join' } }), [
        { op: { type: 'addChannel', channel: { name: 'test', cid: 'test' } } },
        { resp: { status: 'ok' } },
      ]);
      match(await sys.req({ op: { type: 'channels' } }), [
        { op: { channel: { name: 'main' } } },
        { op: { channel: { name: 'Mateusz' } } },
        { op: { channel: { name: 'test' } } },
        { resp: { status: 'ok' } },
      ]);
    });
  });
  describe('/leave', () => {
    it('should remove channel from list', async () => {
      await sys.req({ command: { name: 'login', args: ['mateusz', '123'] } });
      await sys.req({ command: { name: 'channel', args: ['test'] } });
      match(await sys.req({ command: { name: 'leave' } }), [
        { op: { type: 'rmChannel' } },
        { priv: true },
        { resp: { status: 'ok' } },
      ]);
      match(await sys.req({ op: { type: 'channels' } }), [
        { op: { channel: { name: 'main' } } },
        { op: { channel: { name: 'Mateusz' } } },
        { resp: { status: 'ok' } },
      ]);
    });
  });
};
