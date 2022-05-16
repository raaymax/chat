module.exports = (sys) => {
  require('./greet.spec')(sys);
  require('./ping.spec')(sys);
  require('./typing.spec')(sys);
  require('./restore.spec')(sys);
  require('./channel.spec')(sys);
};
