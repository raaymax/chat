const webpush = require('web-push');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECRETS_FILE = path.resolve(__dirname, '../secrets.json');

module.exports = () => {
  if (!fs.existsSync(SECRETS_FILE)) {
    const vapidKeys = webpush.generateVAPIDKeys();
    fs.writeFileSync(SECRETS_FILE, JSON.stringify({
      vapid: vapidKeys,
      sessionSecret: crypto.randomBytes(64).toString('hex'),
    }));
  }
};
