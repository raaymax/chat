export async function up(db) {
    const channels = await db.collection('channels').find({}).toArray();
    const channelsByCid = channels.reduce((acc, channel) => {
        acc[channel.cid] = channel._id;
        return acc;
    }, {});

    const cursor = await db.collection('messages')
        .find({ channelId: { $exists: false } });

    while (await cursor.hasNext()) {
        const message = await cursor.next();
        await db.collection('messages')
            .updateOne({ _id: message._id }, {
                $set: { channelId: channelsByCid[message.channel] },
            });
    }
}
export async function down(db) {
    return db.collection('messages').updateMany({}, { $unset: { channelId: true } });
}
