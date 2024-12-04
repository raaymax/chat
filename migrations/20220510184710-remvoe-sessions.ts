export async function up(db) {
    return db.collection('sessions').deleteMany({});
}
export async function down() {
    // empty
}
