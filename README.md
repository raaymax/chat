<p align="center">
  <img src="quack.png" title="hover text">
</p>


Welcome to the Quack - private chatting application.

One of the major highlights of my chat application is its accessibility and ease of use, regardless of the device or platform. The application is designed to be installed easily anywhere or used directly from the web, without any hassle.

We support Trusted Web Activity (TWA) and Progressive Web App (PWA) technologies, making it easy to access the application from your mobile device, tablet or desktop. Our clean and intuitive design provides a seamless and enjoyable chat experience.

To ensure a lightweight and efficient application, we have minimized the use of unnecessary plugins and add-ons. We believe that a clutter-free interface enhances the user experience, enabling them to focus on their conversations without distractions.

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

Then create local mongo server with docker-compose

```bash
docker-compose -f docker-compose.dev.yml up -d
```

next start local development server

```bash
npm run dev
```

## License

MIT
