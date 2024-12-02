import { defineConfig } from '@quack/config';
import giphy from './plugins/giphy.ts';

export default defineConfig({
	port: 3001,
  databaseUrl: 'mongodb://chat:chat@mongo:27017/chat?authSource=admin',
	vapidSubject: 'mailto:admin@example.com',
	storage: {
		type: 'fs',
		directory: './uploads',
	},
  plugins: [
    giphy({
      giphyApiKey: 'secret-api-key',
    })
  ]
})
