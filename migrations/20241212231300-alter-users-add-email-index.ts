export async function up(db) {
    return db.collection('users').createIndex({ login: 1 }, { unique: true });
}
export async function down(db) {
    return db.collection('users').createIndex({ login: 1 }, { unique: false });
}
