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

eval("const EXTERNAL_ASSETS = ['https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.js', 'https://cdn.quilljs.com/1.3.6/quill.js', 'https://cdn.quilljs.com/1.3.6/quill.snow.css', 'https://unpkg.com/quill-emoji@0.2.0/dist/quill-emoji.css', 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'];\nconst ASSETS = ['/assets/sound.mp3', '/assets/icons/favicon-16x16.png', '/assets/icons/mstile-150x150.png', '/assets/icons/favicon-32x32.png', '/assets/icons/android-chrome-512x512.png', '/assets/icons/apple-touch-icon.png', '/assets/icons/android-chrome-192x192.png', '/assets/emoji_list.json', '/assets/favicon.ico', '/assets/fontawesome/webfonts/fa-v4compatibility.ttf', '/assets/fontawesome/webfonts/fa-brands-400.woff2', '/assets/fontawesome/webfonts/fa-solid-900.ttf', '/assets/fontawesome/webfonts/fa-regular-400.ttf', '/assets/fontawesome/webfonts/fa-solid-900.woff2', '/assets/fontawesome/webfonts/fa-regular-400.woff2', '/assets/fontawesome/webfonts/fa-brands-400.ttf', '/assets/fontawesome/webfonts/fa-v4compatibility.woff2', '/assets/fontawesome/css/all.css', '/assets/fontawesome/css/all.min.css', '/manifest.json', '/sw.js', '/index.css', '/index.html', '/index.js', '/'];\nself.addEventListener('install', event => {\n  async function onInstall() {\n    const cache = await caches.open('static');\n    await cache.addAll(ASSETS);\n    await cache.addAll(EXTERNAL_ASSETS);\n  }\n\n  event.waitUntil(onInstall(event));\n});\nself.addEventListener('fetch', event => {\n  if (event.request.method === 'PUT') {\n    return;\n  }\n\n  if (EXTERNAL_ASSETS.includes(event.request.url)) {\n    event.respondWith(caches.match(event.request).then(response => {\n      if (response) {\n        return response;\n      }\n\n      return fetch(event.request);\n    }));\n  } else if (ASSETS.includes(event.request.url)) {\n    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));\n  } else {\n    event.respondWith(fetch(event.request));\n  }\n});\nself.addEventListener('activate', event => {\n  event.waitUntil(async () => {\n    await Promise.all(ASSETS.map(asset => cache.delete(asset)));\n  });\n});\nself.addEventListener('push', e => {\n  // eslint-disable-next-line no-console\n  console.log('[SW] notification', e);\n  const data = e.data.json();\n  e.waitUntil((async () => {\n    try {\n      await self.registration.showNotification(data.title, {\n        body: data.description,\n        tag: data.channel,\n        vibrate: [100, 50, 100],\n        silent: false,\n        data: {\n          dateOfArrival: Date.now(),\n          primaryKey: '2'\n        },\n        actions: [{\n          action: 'open',\n          title: 'Go to message'\n        }]\n      });\n    } catch (err) {\n      // eslint-disable-next-line no-console\n      console.error(err);\n    }\n\n    const client = await getOpenClient();\n\n    if (client) {\n      await client.postMessage({\n        type: 'sound'\n      });\n    }\n  })());\n});\nself.addEventListener('notificationclick', event => {\n  event.notification.close();\n  event.waitUntil(clients.matchAll({\n    type: 'window'\n  }).then(clientList => {\n    for (let i = 0; i < clientList.length; i++) {\n      const client = clientList[i];\n      if (client.url === '/' && 'focus' in client) return client.focus();\n    }\n\n    if (clients.openWindow) return clients.openWindow('/');\n  }));\n});\n\nfunction getOpenClient() {\n  return clients.matchAll({\n    type: 'window'\n  }).then(clientList => clientList[0]);\n}\n\n//# sourceURL=webpack://@quack/app/./src/sw.js?");

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