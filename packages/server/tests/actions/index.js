module.exports = (connect) => {
  describe('actions', () => {
    require('./message.spec')(connect);
    require('./setupFcm.spec')(connect);
    require('./typing.spec')(connect);
    require('./updateMessage.spec')(connect);
    require('./command.spec')(connect);
    require('./pins.spec')(connect);
    //require('./badges.spec')(connect);
    require('./search.spec')(connect);
  });
};
