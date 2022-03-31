/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/sw.js":
/*!*******************!*\
  !*** ./src/sw.js ***!
  \*******************/
/***/ (() => {

eval("const EXTERNAL_ASSETS = [\n  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.js',\n  'https://cdn.quilljs.com/1.3.6/quill.js',\n  'https://cdn.quilljs.com/1.3.6/quill.snow.css',\n  'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.css',\n  'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',\n];\n\nconst ASSETS = [\n  '/assets/icons/favicon-16x16.png',\n  '/assets/icons/mstile-150x150.png',\n  '/assets/icons/favicon-32x32.png',\n  '/assets/icons/android-chrome-512x512.png',\n  '/assets/icons/apple-touch-icon.png',\n  '/assets/icons/android-chrome-192x192.png',\n  '/assets/emoji_list.json',\n  '/assets/favicon.ico',\n  '/assets/fontawesome/webfonts/fa-v4compatibility.ttf',\n  '/assets/fontawesome/webfonts/fa-brands-400.woff2',\n  '/assets/fontawesome/webfonts/fa-solid-900.ttf',\n  '/assets/fontawesome/webfonts/fa-regular-400.ttf',\n  '/assets/fontawesome/webfonts/fa-solid-900.woff2',\n  '/assets/fontawesome/webfonts/fa-regular-400.woff2',\n  '/assets/fontawesome/webfonts/fa-brands-400.ttf',\n  '/assets/fontawesome/webfonts/fa-v4compatibility.woff2',\n  '/assets/fontawesome/css/all.css',\n  '/assets/fontawesome/css/all.min.css',\n  '/manifest.json',\n  '/sw.js',\n  '/index.css',\n  '/index.html',\n  '/index.js',\n  '/',\n];\n\nself.addEventListener('install', (event) => {\n  async function onInstall() {\n    const cache = await caches.open('static');\n    await cache.addAll(ASSETS);\n    await cache.addAll(EXTERNAL_ASSETS);\n  }\n  event.waitUntil(onInstall(event));\n});\n\nself.addEventListener('fetch', (event) => {\n  if (EXTERNAL_ASSETS.includes(event.request.url)) {\n    event.respondWith(\n      caches.match(event.request)\n        .then((response) => {\n          if (response) {\n            return response;\n          }\n          return fetch(event.request);\n        }),\n    );\n  } else if (ASSETS.includes(event.request.url)) {\n    event.respondWith(\n      fetch(event.request)\n        .catch(() => caches.match(event.request)),\n    );\n  } else {\n    event.respondWith(fetch(event.request));\n  }\n});\n\nself.addEventListener('activate', (event) => {\n  event.waitUntil(async () => {\n    await Promise.all(ASSETS.map((asset) => cache.delete(asset)));\n  });\n});\n\nself.addEventListener('push', (e) => {\n  // eslint-disable-next-line no-console\n  console.log('[SW] notification', e);\n  const data = e.data.json();\n  e.waitUntil(\n    self.registration.showNotification(data.title, {\n      body: data.description,\n      tag: data.channel,\n      vibrate: [100, 50, 100],\n      silent: false,\n      data: {\n        dateOfArrival: Date.now(),\n        primaryKey: '2',\n      },\n      actions: [\n        { action: 'open', title: 'Go to message' },\n      ],\n    }),\n  );\n});\n\nself.addEventListener('notificationclick', (event) => {\n  // eslint-disable-next-line no-console\n  console.log('On notification click: ', event.notification.tag);\n  event.notification.close();\n\n  event.waitUntil(clients.matchAll({\n    type: 'window',\n  }).then((clientList) => {\n    for (let i = 0; i < clientList.length; i++) {\n      const client = clientList[i];\n      if (client.url === '/' && 'focus' in client) return client.focus();\n    }\n    if (clients.openWindow) return clients.openWindow('/');\n  }));\n});\n\n\n//# sourceURL=webpack://quack/./src/sw.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/sw.js"]();
/******/ 	
/******/ })()
;