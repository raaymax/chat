module.exports = (sys) => {
  require('./login.spec')(sys);
  require('./changeName.spec')(sys);
  require('./help.spec')(sys);
  require('./channel.spec')(sys);
};
