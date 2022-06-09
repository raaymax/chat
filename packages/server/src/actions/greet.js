module.exports = async (self, msg) => {
  await self.send(msgFactory.createSystemMessage({
    id: 'greet',
    seqId: msg.seqId,
    message: [
      { text: 'Hello!' }, { emoji: 'wave' }, { br: true },
      { text: 'You can use "/help" to get more info' }, { br: true },
      { text: 'You won\'t be able to send any messages until you login' }, { br: true },
    ],
  }));
  await msg.ok();
};
