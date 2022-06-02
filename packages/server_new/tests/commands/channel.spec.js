const { match } = require('../helpers');

module.exports = (sys) => {
  describe('/channel <channel_name>', () => {
    it('should respond with error for not logged user', async () => {
      match(await sys.req({ type: 'command', cmd: 'channel', args: ['test'] }), [
        { type: 'response', status: 'error' },
      ]);
    });
    it('should respond channel change message', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'command', cmd: 'channel', args: ['test'] }), [
        { type: 'setChannel', channel: 'test' },
        { type: 'response', status: 'ok' },
      ]);
    });
    it('should deny access to private channels', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'command', cmd: 'channel', args: ['6255a4156c28443c92c26d7e'] }), [
        { type: 'response', status: 'error' },
      ]);
    });
  });
  describe('/join', () => {
    it('should add channel to list', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      await sys.req({ type: 'command', cmd: 'channel', args: ['test'] });
      match(await sys.req({ type: 'command', cmd: 'join' }), [
        { type: 'addChannel', channel: { name: 'test', cid: 'test' } },
        { type: 'response', status: 'ok' },
      ]);
      match(await sys.req({ type: 'channels' }), [
        { channel: { name: 'main' } },
        { channel: { name: 'Mateusz' } },
        { channel: { name: 'test' } },
        { type: 'response', status: 'ok' },
      ]);
    });
  });
  describe('/leave', () => {
    it('should remove channel from list', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      await sys.req({ type: 'command', cmd: 'channel', args: ['test'] });
      match(await sys.req({ type: 'command', cmd: 'leave' }), [
        { type: 'rmChannel' },
        { type: 'message', priv: true },
        { type: 'response', status: 'ok' },
      ]);
      match(await sys.req({ type: 'channels' }), [
        { channel: { name: 'main' } },
        { channel: { name: 'Mateusz' } },
        { type: 'response', status: 'ok' },
      ]);
    });
  });
};
