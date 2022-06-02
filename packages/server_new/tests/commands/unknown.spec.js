const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/unknown', () => {
    it('should respond with error command not found', async () => {
      match(await sys.req({ type: 'command', cmd: 'unknown', args: [] }), [
        partial({ type: 'response', status: 'error' }),
      ]);
    });
  });
};
