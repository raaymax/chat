 

const getChannelType = (channel) => {
  if (channel.direct) return 'DIRECT';
  if (channel.private) return 'PRIVATE';
  return 'PUBLIC';
};

export async function up(db) {
    const cursor = await db.collection('channels').find({});
    while (await cursor.hasNext()) {
        const channel = await cursor.next();
        await db.collection('channels')
            .updateOne({ _id: channel._id }, {
                $set: { channelType: getChannelType(channel) },
            });
    }
}
export async function down() {
    // Nothing
}
