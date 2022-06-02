module.exports = {
  ping: (req, res) => {
    res.ok();
  },
  default: (req, res) => {
    throw new Error('Unknown action');
  }
}
