const { PubSub } = require('@google-cloud/pubsub');
const repo = require('../../app/repository');

const pubsub = new PubSub();
const subscriptionName = 'quack';
const topicName = 'rss-feed-check';
const actions = require('../../app/actions');

const [topic] = await pubsub.createTopic(topicName)
  .catch(() => pubsub.topic(topicName));

const [subscription] = await topic.createSubscription(subscriptionName)
  .catch(() => topic.subscription(subscriptionName));

subscription
  .on('message', async (message) => {
    try {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify({
        type: 'rssFeedCheck',
        data: message.data,
        userId: (await repo.user.get({ name: 'System' })).id,
      }));
      actions.dispatch({
        type: 'rssFeedCheck',
        data: message.data,
        userId: (await repo.user.get({ name: 'System' })).id,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    message.ack();
  });
