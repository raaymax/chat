const {
  match,
  partial,
} = require('../helpers');

module.exports = (sys) => {
  describe('/channel <channel_name>', () => {
    it('should respond channel change message', async () => {
      match(await sys.req({command: {name: 'channel', args: ['test']}}), [
        partial({ op: {type: 'setChannel', channel: 'test'} }),
        partial({ resp: {status: 'ok'} })
      ])
    })
  });

}

