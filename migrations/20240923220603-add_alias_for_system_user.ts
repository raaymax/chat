export async function up(db, client) {
    await db.collection('users').updateOne({ login: 'system' }, { $set: { alias: 'system' } });
}
export async function down(db, client) {
    await db.collection('users').updateOne({ login: 'system' }, { $unset: { alias: true } });
}
