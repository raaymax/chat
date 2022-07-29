module.exports = {
  async up(db) {
    const users = await db.collection('users').find({}).toArray();
    await Promise.all(users.map((u) => db.collection('channels').insertOne({
      cid: `bob+${u._id.toHexString()}`,
      name: 'Bob',
      users: [u._id],
      private: true,
      createdAt: new Date(),
    })));
  },

  async down(db) {
    return db.collection('channels').deleteMany({});
  },
};
