
module.exports = (connect) => {
  require('./message.spec')(connect);
  require('./load.spec')(connect);
  require('./setupFcm.spec')(connect);
  require('./channels.spec')(connect);
  require('./typing.spec')(connect);
  require('./greet.spec')(connect);
  require('./removeMessage.spec')(connect);
}
