const crypto = require('crypto');
const bcrypt = require('bcrypt');

exports.genToken = () => crypto.randomBytes(48).toString('hex');
exports.genHash = (data) => bcrypt.hashSync(data, 10);
