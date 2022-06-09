const connections = require('../connections');

module.exports = (self, msg) => {
  const { user, session } = connections.getByConnection(self.ws, msg.token); // rename to activate?
  msg.ok({ user, session }); // filter user data
};
