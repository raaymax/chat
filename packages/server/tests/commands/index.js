module.exports = (connect) => {
  require('./help.spec')(connect);
  require('./join.spec')(connect);
  require('./leave.spec')(connect);
  require('./avatar.spec')(connect);
  require('./name.spec')(connect);
  require('./ai.spec')(connect);
  require('./prompt.spec')(connect);
  require('./me.spec')(connect);
};
