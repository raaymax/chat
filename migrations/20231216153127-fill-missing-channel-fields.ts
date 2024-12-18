 

export async function up(db) {
    const cursor = await db.collection('channels').find({});
    while (await cursor.hasNext()) {
        const channel = await cursor.next();
        await db.collection('channels')
            .updateOne({ _id: channel._id }, {
                $set: {
                    private: Boolean(channel.private),
                    direct: Boolean(channel.direct),
                },
            });
    }
}
export async function down() {
    // Nothing
}
