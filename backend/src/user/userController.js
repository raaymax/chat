const service = require('./userService');

module.exports = {
  restore: async (self, msg) => {
    const {op} = msg;
    if(!op.session) return;
    const restored = await service.sessionRestore(op.session);
    if(!restored) return;
    const {session, user} = restored;
    self.user = user;
    await self.op({
      type: 'setSession',
      session,
    });
  },

  name: async (self, msg) => {
    const {args} = msg.command;
    const prev = self.author;
    self.author = args[0];
    msg.author = args[0];
    return sysBroadcast(`User ${prev} changed name to ${args[0]}`);
  },

  login: async (self, msg) => {
    const {args} = msg.command;
    const {user, session} = await service.login(args[0], args[1]);
    if(!user){
      return self.sys([
        {text: "Login failed"}, {br: true},
      ], true);
    }
    self.user = user;
    self.author = user.name;
    await self.op({
      type: 'setSession',
      session,
    });
    return self.sys([
      {text: "Login successfull"}, {br: true},
      {text: `Welcome ${user.name}`}, {br: true},
    ], true);
  }
}
