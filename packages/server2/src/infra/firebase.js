/* eslint-disable import/no-unresolved */
const admin = require('firebase-admin');
const { getMessaging } = require('firebase-admin/messaging');

if (process.env.NODE_ENV !== 'test') {
  admin.initializeApp({});
}

module.exports = { admin, getMessaging };
