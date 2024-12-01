export async function up(db) {
    db.collection('users').updateMany({ login: { $in: ['system'] } }, { $set: { system: true } });
}
export async function down(db) {
    db.collection('users').updateMany({ login: { $in: ['system'] } }, { $unset: { system: true } });
}
