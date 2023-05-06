/* eslint-disable import/no-unresolved */
const webpush = require('web-push');
const conf = require('../../../../config');

webpush.setVapidDetails(
  'mailto:user@example.org',
  conf.vapid.publicKey,
  conf.vapid.privateKey,
);

const push = async (subs, notif) => {
  const { data, ...options } = notif;
  return Promise.all(subs.map((sub) => {
    try {
      return webpush.sendNotification(
        sub,
        JSON.stringify(data),
        { ...options },
      );
    } catch (err) {
      // TODO: if endpoint is not valid, remove it from the list
      //
      // eslint-disable-next-line no-console
      console.log(err);
      return null;
    }
  }));
};

module.exports = { push };
