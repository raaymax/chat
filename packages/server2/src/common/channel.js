const { channelRepo } = require('../infra/database');


module.exports = {
  haveAccess: async (userId, cid) => {
    const channel = await channelRepo.get({cid});

    if(channel?.private 
        && !channel.users.map((u) => u.toHexString()).includes(userId)) {
      return false;
    }
    return true;
  }
}
