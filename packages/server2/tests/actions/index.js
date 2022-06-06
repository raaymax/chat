
module.exports = (connect) => {
  describe('actions', () => {
    require('./message.spec')(connect);
    require('./users.spec')(connect);
    require('./load.spec')(connect);
    require('./setupFcm.spec')(connect);
    require('./channels.spec')(connect);
    require('./typing.spec')(connect);
    require('./greet.spec')(connect);
    require('./removeMessage.spec')(connect);
    require('./config.spec')(connect);
    require('./command.spec')(connect);
  })
}
