const crypto = require('crypto');

exports.genToken = () => crypto.randomBytes(48).toString('hex');
exports.genHash = (data) => crypto.createHash('sha256').update(data).digest('hex');
