
exports.genToken = () => require('crypto').randomBytes(48).toString('hex');
exports.genHash = (data) => require('crypto').createHash('sha256').update(data).digest('hex');
