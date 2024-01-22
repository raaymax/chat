import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import config from '@quack/config'
import pack from '../../package.json'

export default defineConfig({
  define: {
    APP_VERSION: JSON.stringify(pack.version),
    APP_NAME: JSON.stringify(pack.name),
    PLUGIN_LIST: JSON.stringify(config.plugins),
    API_URL: JSON.stringify(config.apiUrl),
  },
  plugins: [react(), VitePWA({
    strategies: 'injectManifest',
    srcDir: './src',
    filename: 'sw.js',
  })],
})
