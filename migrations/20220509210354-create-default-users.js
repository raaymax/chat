import { ObjectId } from 'npm:mongodb';

export async function up(db) {
  if (await db.collection('users').countDocuments() === 0) {
    await db.collection('users').insertMany([
      {
        _id: new ObjectId('6255a4156c28443c92c26d7e'),
        clientId: '7ed5c52c-35f8-4a27-929d-ff5eb1a74924',
        login: 'admin',
        password: '$2b$10$WHWomdHBQJLwpHdjUn1lRuh8sP9tBPqPN3b4sP8EeBJ1Hk.eqtG4a', // "123" => bcrypt.hashSync('123', 10)
        name: 'Admin',
        avatarUrl: '/avatar.png',
      },
    ]);
  }
}

export async function down(db) {
  return db.collection('users').deleteMany({});
}
