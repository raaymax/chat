const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('@quack/config');

exports.genToken = () => crypto.randomBytes(48).toString('hex');
exports.genHash = (data) => bcrypt.hashSync(data, 10);

exports.createImageUrl = (id) => (id ? `${config.imagesUrl}/${id}` : undefined);
