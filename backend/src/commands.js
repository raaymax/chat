
exports.handleCommands = async (srv, self, msg) => {
  const {args} = msg.command;
  switch(msg.command.name) {
    case 'name': 
      const prev = self.author;
      self.author = args[0];
      msg.author = args[0];
      return sysBroadcast(`User ${prev} changed name to ${args[0]}`);
    case 'help':
      return self.send(srv.sysMsg([
        {text: "/channel <name> - change current channel"}, {br: true},
        {text: "/name <name> - to change your name"}, {br: true},
        {text: "/login <name> <password> - login to your account"}, {br: true},
        {text: "/help - display this help"}, {br: true},
      ], true));
    case 'login':
      const {user, session} = await srv.users.login(args[0], args[1]);
      if(!user){
        return self.send(srv.sysMsg([
          {text: "Login failed"}, {br: true},
        ], true));
      }
      self.user = user;
      self.author = user.name;
      await self.op({
        type: 'set:session',
        session,
      });
      return self.send(srv.sysMsg([
        {text: "Login successfull"}, {br: true},
        {text: `Welcome ${user.name}`}, {br: true},
      ], true));
    case 'channel': 
      self.channel = args[0];
      await self.op({
        type: 'set:channel',
        channel: self.channel,
      });
  }
}
