const { dispatch } = require('../index');
const repo = require('../../../infra/repositories');

// eslint-disable-next-line no-async-promise-executor
const createBus = (fn) => new Promise(async (resolve, reject) => {
  const data = [];
  try {
    await fn({
      hasKey: () => true,
      getListeners: () => ({ all: 0 }),
      direct: (userId, msg) => {
        msg._userId = userId;
        if (msg.type === 'response') {
          resolve({ res: msg, data });
          return;
        }
        data.push(msg);
      },
      group: (userIds, msg) => {
        msg._userIds = userIds;
        if (msg.type === 'response') {
          resolve({ res: msg, data });
          return;
        }
        data.push(msg);
      },
      broadcast: (msg) => data.push(msg),
    });
  } catch (err) {
    reject(err);
  }
});

const sendMessage = async (msg, opts = {}) => createBus((bus) => dispatch(msg, { bus, push: () => null, ...opts }));

module.exports = {
  sendMessage,
  repo,
};
