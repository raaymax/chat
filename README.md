![quack](https://github.com/codecat-io/chat/raw/master/quack.png)

Messaging app

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
  sentryDns: '',
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

Then create local mongo server with docker-compose

```bash
docker-compose -f docker-compose.dev.yml up -d
```

next start local development server

```bash
npm run dev
```

## License

MIT - Feel free to use this code however you want.
