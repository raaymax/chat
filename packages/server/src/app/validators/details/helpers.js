function getByPath(path, object) {
  return path.split('.').reduce((o, i) => o[i], object);
}

module.exports = {
  getByPath,
};
