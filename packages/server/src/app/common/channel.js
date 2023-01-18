const db = require('../../infra/database');

module.exports = {
  haveAccess: async (userId, id) => {
    const channel = await db.channel.get({ id });

    if (channel?.private
        && !channel.users.includes(userId)) {
      return false;
    }
    return true;
  },
};
