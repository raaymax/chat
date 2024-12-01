 
export async function up(db) {
    return db.collection('messages').createIndex({ flat: 'text' });
}
export async function down(db) {
    return db.collection('messages').createIndex({ flat: 'text' });
}
