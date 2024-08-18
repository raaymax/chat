/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'npm:vite';
import react from 'npm:@vitejs/plugin-react';
import { VitePWA } from 'npm:vite-plugin-pwa';
import { fileURLToPath } from 'node:url'
import { build } from 'npm:vite'
import { pluginDeno } from 'jsr:@deno-plc/vite-plugin-deno';

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const config = defineConfig({
  root: __dirname,
  configFile: false,
  define: {
    APP_VERSION: JSON.stringify(Deno.env.get('APP_VERSION')),
    APP_NAME: JSON.stringify(Deno.env.get('APP_NAME')),
    API_URL: JSON.stringify('http://localhost:8008'),
  },
  plugins: [
    react(),
    await pluginDeno({}),
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

await build(config)