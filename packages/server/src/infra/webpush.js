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
    try{
      return webpush.sendNotification(
          sub,
          JSON.stringify(data),
          { ...options }
      );
    }catch(err){
      console.log(err);
    }
  }));
};

module.exports = { push };
