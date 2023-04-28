const { dispatch } = require('../index');
const repo = require('../../../infra/repositories');

// eslint-disable-next-line no-async-promise-executor
const createBus = (fn) => new Promise(async (resolve, reject) => {
  const data = [];
  try {
    await fn({
      direct: (userId, msg) => {
        msg._userId = userId;
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

const sendMessage = async (msg, opts = {}) => createBus((bus) => dispatch(msg, { bus, ...opts }));

module.exports = {
  sendMessage,
  repo,
};
