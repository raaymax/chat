const webpush = require('web-push');

function initWebPush() {
  webpush.setGCMAPIKey(process.env.GCM_API_KEY);
  webpush.setVapidDetails(
    'mailto:push@codecat.io',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_SECRET,
  );
  return webpush;
}

module.exports = process.env.GCM_API_KEY
  ? initWebPush()
  : {
    sendNotification: () => {},
  };
