/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import config from '@quack/config';
// eslint-disable-next-line import/no-relative-packages
import pack from '../../package.json';
import basicSsl from '@vitejs/plugin-basic-ssl'
import proxy from "vite-plugin-http2-proxy";
import path from 'node:path';
import fs from 'node:fs';

const __dirname = new URL('.', import.meta.url).pathname;
const sslPath = path.join(__dirname, '../../ssl/');

export default defineConfig({
  define: {
    APP_VERSION: JSON.stringify(pack.version),
    APP_NAME: JSON.stringify(pack.name),
    PLUGIN_LIST: JSON.stringify((config as any).plugins),
    //API_URL: JSON.stringify((config as any).apiUrl),
    API_URL: JSON.stringify('https://localhost:5173'),
  },
  plugins: [
    react(),
    basicSsl({
      name: 'test',
      domains: ['localhost'],
      certDir: sslPath,
    }),
    proxy({
      "^/api/": {
        target: "http://localhost:8008",
      },
    }),
    VitePWA({
      injectRegister: 'auto',
      strategies: 'injectManifest',
      srcDir: './src',
      filename: 'sw.ts',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      manifest: {
        id: 'io.codecat.chat.pwa',
        name: 'Quack',
        short_name: 'quack',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#1a1d21',
        theme_color: '#673ab8',
        icons: [
          {
            src: '/icons/android-chrome-192x192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any maskable',
          },
          {
            src: '/icons/android-chrome-512x512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any maskable',
          },
        ],
        share_target: {
          action: '/share',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            title: 'title',
            text: 'text',
            url: 'url',
          },
        },
      },
    })
  ],
});
