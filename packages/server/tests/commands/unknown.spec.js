const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/unknown', () => {
    it('should respond with error command not found', async () => {
      match(await sys.req({ command: { name: 'unknown', args: [] } }), [
        partial({ resp: { status: 'error' } }),
      ]);
    });
  });
};
