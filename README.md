<p align="center">
  <img src="quack.png" title="hover text">
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Welcome to the Quack - private chatting application.

Quack is a free and open-source chat application designed for private use. 
With its easy-to-use interface and seamless integration with web browsers, Quack is a Progressive Web Application that can be accessed from any platform that has a web browser, such as Chrome.

Quack is inspired by Slack, but is more affordable for private use. Although it doesn't have any unique features, it combines the best features from other communicators.
Quack prioritizes privacy and security by allowing users to host their own app, ensuring that they have complete control over their data.

## Configuration

`chat.config.js` (example in `chat.config.example.js`)
```javascript
module.exports = {
  port: 8080, 
  vapid: {
    public: '',
    secret: '',
  },
  databaseUrl: process.env.DATABASE_URL,
  
  cors: [
    'http://localhost:8080',
  ],
  fileStorage: process.env.NODE_ENV === 'test' ? 'memory' : 'gcs',
  gcsBucket: '',
  serverUrl: 'http://localhost:8080',
  imagesUrl: '',
  serverWebUrl: '',
  openaiApiKey: '',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
  },
};
```
In this case env variable `DATABSE_URL` will be used to connect to the database.

## Environment variables

`ENABLE_PUBSUB` [boolean] - will connect to google pubsub


## Requirements
- MongoDB
- Firebase (for notifications)
- google cloud key for GCS


## Decisions

### Database
Serverless mongodb instance because it's reliable and we pay only for what we used.

### Server
It would be nice to have a serverless solution but for now cheepest GCE is used.  
No idea how to propagate messages to other serverless instances.  
mongo, redis, postgres need to be hosted to be able to watch for messages.  
Maybe pub/sub would work but it seems complicated.  

## Local development setup

```bash
pnpm i
docker-compose up -d
pnpm run dev
```

## License

MIT
