const { PubSub } = require('@google-cloud/pubsub');

const pubsub = new PubSub();
const subscriptionName = 'quack';
const topicName = 'rss-feed-check';
const subscription = pubsub.subscription(subscriptionName);
const actions = require('../../app/actions');

subscription
  .on('message', message => {
    actions.dispatch({type: 'rssFeedCheck', userId: });

    message.ack();
  })
  .on('error', error => {
    console.error(error);
  });

// Subscribe to the topic
subscription.create(topicName)
  .then(() => {
    console.log(`Subscription ${subscriptionName} created.`);
  })
  .catch(error => {
    console.error(`Error creating subscription ${subscriptionName}: ${error}`);
  });

