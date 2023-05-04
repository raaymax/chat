const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../../../../config');

exports.genToken = () => crypto.randomBytes(48).toString('hex');
exports.genHash = (data) => bcrypt.hashSync(data, 10);

exports.createImageUrl = (id) => `${config.imagesUrl}/${id}`;
