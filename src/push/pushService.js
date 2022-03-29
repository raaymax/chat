const webpush = require('web-push');

webpush.setGCMAPIKey(process.env.GCM_API_KEY);
webpush.setVapidDetails(
  'mailto:push@codecat.io',
  process.env.VAPID_PUBLIC,
  process.env.VAPID_SECRET,
);

module.exports = webpush;
