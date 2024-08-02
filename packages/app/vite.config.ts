/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import config from '@quack/config';
// eslint-disable-next-line import/no-relative-packages
import pack from '../../package.json';

export default defineConfig({
  define: {
    APP_VERSION: JSON.stringify(pack.version),
    APP_NAME: JSON.stringify(pack.name),
    PLUGIN_LIST: JSON.stringify((config as any).plugins),
    //API_URL: JSON.stringify((config as any).apiUrl),
    API_URL: JSON.stringify('http://localhost:8008'),
  },
  plugins: [react(), VitePWA({
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
  })],
});
