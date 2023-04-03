/* eslint-disable import/no-unresolved */
const admin = require('firebase-admin');
const { getMessaging } = require('firebase-admin/messaging');

if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp({});
}
const push = async (message) => {
  try {
    return getMessaging().sendMulticast(message);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    throw e;
  }
};

module.exports = { admin, getMessaging, push };
