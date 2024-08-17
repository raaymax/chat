import { faker } from 'npm:@faker-js/faker';
import { Repository } from './infra/mod.ts';
import config from '@quack/config';

const repo = new Repository(config);

const user = await repo.user.get({login: 'admin'});
const user2 = await repo.user.get({login: 'member'});
const channel = await repo.channel.get({name: 'main'});

//await repo.message.removeMany({channelId: channel.id});
for (let i = 0; i < 1000; i++) {
  const text = faker.lorem.sentence();
  console.log(`Creating message: ${text}`);
  await repo.message.create({
    userId: Math.random() > 0.5 ? user.id : user2.id,
    channelId: channel.id,
    clientId: faker.string.uuid(),
    flat: text,
    message: {
      text: text,
    },
    createdAt: new Date(),
  });
}
await repo.close()
