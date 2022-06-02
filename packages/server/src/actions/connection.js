
module.exports = async (self, msg) => {
  await self.send({
    type: 'setConfig',
    config: {
      appVersion: pack.version,
      applicationServerKey: process.env.VAPID_PUBLIC,
    },
  }),
  
}
