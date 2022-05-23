const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/avatar <url>', () => {
    it('should respond with error for not logged user', async () => {
      match(await sys.req({ type: 'command', cmd: 'avatar', args: ['http://example.com/image.jpg'] }), [
        partial({
          type: 'response',
          status: 'error',
          data: {
            errorCode: 'ACCESS_DENIED',
          },
        }),
      ]);
    });
    it('should respond with ok for logged user', async () => {
      await sys.req({ type: 'command', cmd: 'login', args: ['mateusz', '123'] });
      match(await sys.req({ type: 'command', cmd: 'avatar', args: ['http://example.com/image.jpg'] }), [
        partial({
          type: 'response',
          status: 'ok',
        }),
      ]);
    });
  });
};
