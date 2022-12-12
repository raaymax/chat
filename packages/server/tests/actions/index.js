module.exports = (connect) => {
  describe('actions', () => {
    require('./message.spec')(connect);
    require('./users.spec')(connect);
    require('./load.spec')(connect);
    require('./setupFcm.spec')(connect);
    require('./channels.spec')(connect);
    require('./typing.spec')(connect);
    require('./greet.spec')(connect);
    require('./updateMessage.spec')(connect);
    require('./removeMessage.spec')(connect);
    require('./config.spec')(connect);
    require('./command.spec')(connect);
    require('./pins.spec')(connect);
    require('./badges.spec')(connect);
    require('./search.spec')(connect);
    require('./createChannel.spec')(connect);
  });
};
