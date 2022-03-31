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

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://quack/./src/style.css?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ \"./src/style.css\");\n/* harmony import */ var _js_init__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/init */ \"./src/js/init.js\");\n/* harmony import */ var _js_init__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_js_init__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _js_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/core */ \"./src/js/core.js\");\n/* harmony import */ var _js_pages_chat__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./js/pages/chat */ \"./src/js/pages/chat.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_js_core__WEBPACK_IMPORTED_MODULE_2__, _js_pages_chat__WEBPACK_IMPORTED_MODULE_3__]);\n([_js_core__WEBPACK_IMPORTED_MODULE_2__, _js_pages_chat__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/index.js?");

/***/ }),

/***/ "./src/js/components/chat.js":
/*!***********************************!*\
  !*** ./src/js/components/chat.js ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Chat\": () => (/* binding */ Chat)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n/* harmony import */ var _messageList_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./messageList.js */ \"./src/js/components/messageList.js\");\n/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./header.js */ \"./src/js/components/header.js\");\n/* harmony import */ var _input_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./input.js */ \"./src/js/components/input.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _messageList_js__WEBPACK_IMPORTED_MODULE_1__, _header_js__WEBPACK_IMPORTED_MODULE_2__, _input_js__WEBPACK_IMPORTED_MODULE_3__]);\n([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _messageList_js__WEBPACK_IMPORTED_MODULE_1__, _header_js__WEBPACK_IMPORTED_MODULE_2__, _input_js__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\nconst Chat = () => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n    <${_header_js__WEBPACK_IMPORTED_MODULE_2__.Header} />    \n    <${_messageList_js__WEBPACK_IMPORTED_MODULE_1__.MessageList} />\n    <${_input_js__WEBPACK_IMPORTED_MODULE_3__.Input} />\n  `;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/chat.js?");

/***/ }),

/***/ "./src/js/components/header.js":
/*!*************************************!*\
  !*** ./src/js/components/header.js ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Header\": () => (/* binding */ Header)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n/* harmony import */ var _store_channel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/channel.js */ \"./src/js/store/channel.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _store_channel_js__WEBPACK_IMPORTED_MODULE_1__]);\n([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _store_channel_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst Header = () => {\n  const [channel, setChannel] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useState)((0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.getChannel)());\n  (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.watchChannel)((m) => setChannel(m));\n\n  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n    <div id=\"workspace-header\">\n      <div class=\"channel\">${channel}</div>     \n      ${channel !== 'main' && _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<div class=\"back\"><a href='#main'>back to main</a></div>`}\n    </div>\n  `;\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/header.js?");

/***/ }),

/***/ "./src/js/components/info.js":
/*!***********************************!*\
  !*** ./src/js/components/info.js ***!
  \***********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Info\": () => (/* binding */ Info)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n/* harmony import */ var _store_info_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/info.js */ \"./src/js/store/info.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _store_info_js__WEBPACK_IMPORTED_MODULE_1__]);\n([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _store_info_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\nconst Info = () => {\n  const [info, setInfo] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useState)(null);\n  (0,_store_info_js__WEBPACK_IMPORTED_MODULE_1__.watchInfo)((m) => setInfo(m));\n\n  return info && _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n    <div class=${['info', info.type].join(' ')}>${info.msg}</div>     \n  `;\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/info.js?");

/***/ }),

/***/ "./src/js/components/input.js":
/*!************************************!*\
  !*** ./src/js/components/input.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Input\": () => (/* binding */ Input)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n/* harmony import */ var _formatter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../formatter.js */ \"./src/js/formatter.js\");\n/* harmony import */ var _info_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./info.js */ \"./src/js/components/info.js\");\n/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../connection.js */ \"./src/js/connection.js\");\n/* harmony import */ var _services_messages_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/messages.js */ \"./src/js/services/messages.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _info_js__WEBPACK_IMPORTED_MODULE_2__, _services_messages_js__WEBPACK_IMPORTED_MODULE_4__]);\n([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _info_js__WEBPACK_IMPORTED_MODULE_2__, _services_messages_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nQuill.register('modules/emoji', QuillEmoji);\n\nlet submit = () => {};\nlet toggle = () => {};\nlet quillFocus = () => {};\n\nlet cooldown = false;\nlet queue = false;\n\nconst send = () => submit();\nconst toggleToolbar = () => toggle();\nconst focus = () => quillFocus();\n\nfunction notifyTyping() {\n  if (cooldown) {\n    queue = true;\n    return;\n  }\n  cooldown = true;\n  queue = false;\n  _connection_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].send({ op: { type: 'typing' } });\n  setTimeout(() => {\n    cooldown = false;\n    if (queue) {\n      notifyTyping();\n    }\n  }, 1000);\n}\n\nfunction initQuill() {\n  const quill = new Quill('#input', {\n    theme: 'snow',\n    modules: {\n      toolbar: [['bold', 'italic', 'underline', 'strike', 'link'], ['emoji'], [{ list: 'ordered' }, { list: 'bullet' }], ['blockquote', 'code', 'code-block'], ['clean']].flat(),\n      'emoji-toolbar': true,\n      'emoji-shortname': true,\n      keyboard: {\n        bindings: {\n          submit: {\n            key: 'enter',\n            handler() {\n              if (navigator.userAgentData.mobile) {\n                return true;\n              }\n              submit();\n              return false;\n            },\n          },\n        },\n      },\n    },\n  });\n\n  quill.focus();\n  quillFocus = () => quill.focus();\n\n  submit = () => {\n    (0,_services_messages_js__WEBPACK_IMPORTED_MODULE_4__.send)((0,_formatter_js__WEBPACK_IMPORTED_MODULE_1__.build)(quill.getContents()));\n    setTimeout(() => {\n      document.getElementById('scroll-stop').scrollIntoView();\n    }, 1);\n    quill.setContents([]);\n    quill.focus();\n  };\n  let visible = true;\n  toggle = () => {\n    if (visible) {\n      document.getElementsByClassName('ql-toolbar')[0].style = 'display: none;';\n    } else {\n      document.getElementsByClassName('ql-toolbar')[0].style = '';\n    }\n    visible = !visible;\n    quill.focus();\n  };\n}\n\nconst Input = () => {\n  const input = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);\n  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => initQuill(), []);\n  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => toggleToolbar(), []);\n  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    input.current.addEventListener('keydown', notifyTyping);\n    return () => input.current.removeEventListener('keydown', notifyTyping);\n  }, []);\n  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n    <div class=\"input-container\" onclick=${focus} >\n      <div id=\"input\" ref=${input}></div>\n      <div class='actionbar'>\n        <${_info_js__WEBPACK_IMPORTED_MODULE_2__.Info} />\n        <div class='action' onclick=${toggleToolbar}>\n          <i class=\"fa-solid fa-paragraph\"></i>\n        </div>\n        <div class='space'></div>\n        <div class='action green' onclick=${send}>\n          <i class=\"fa-solid fa-paper-plane\" />\n        </div>\n      </div>\n    </div>     \n  `;\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/input.js?");

/***/ }),

/***/ "./src/js/components/message.js":
/*!**************************************!*\
  !*** ./src/js/components/message.js ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Message\": () => (/* binding */ Message)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__]);\n_utils_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst build = (datas) => [datas].flat().map((data) => {\n  if (typeof data === 'string') return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.html)(data);\n  const key = Object.keys(data).find((f) => TYPES[f]);\n  if (!key) {\n    return _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`Unknown part: ${JSON.stringify(data)}`;\n  }\n  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<${TYPES[key]} data=${data[key]} />`;\n});\n\nconst TYPES = {\n  bullet: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<ul>${build(props.data)}</ul>`,\n  ordered: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<ol>${build(props.data)}</ol>`,\n  item: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<li>${build(props.data)}</li>`,\n  codeblock: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<pre>${build(props.data)}</pre>`,\n  blockquote: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<blockquote>${build(props.data)}</blockquote>`,\n  code: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<code>${build(props.data)}</code>`,\n  line: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`${build(props.data)}<br/>`,\n  text: (props) => props.data,\n  bold: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<b>${build(props.data)}</b>`,\n  italic: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<em>${build(props.data)}</em>`,\n  underline: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<u>${build(props.data)}</u>`,\n  strike: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<s>${build(props.data)}</s>`,\n  link: (props) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<a href='${props.data.href}'>${build(props.data.children)}</a>`,\n  emoji: (props) => {\n    const emoji = EMOJI.find((e) => e.name === props.data);\n    if (!emoji) return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.html)(`:${props.data}:`);\n    return String.fromCodePoint(parseInt(emoji.unicode, 16));\n  },\n};\n\nconst isToday = (date) => {\n  const someDate = new Date(date);\n  const today = new Date()\n  return someDate.getDate() === today.getDate()\n    && someDate.getMonth() === today.getMonth()\n    && someDate.getFullYear() === today.getFullYear()\n}\n\nconst isOnlyEmoji = (message) => message \n    && message.length === 1 \n    && message[0].line\n    && message[0].line.length === 1 \n    && message[0].line[0].emoji;\n\nconst Message = (props = {}) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n  <div ...${props} class=${['message', ...props.class].join(' ')}>\n    ${!props.sameUser \n      ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<div class='avatar'><img src=${props.avatarUrl}/></div>`\n      : _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<div class='spacy side-time'>${(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTime)(props.date)}</div>`\n    }\n    <div class='body'>\n      ${!props.sameUser && _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<div class='header'>\n        <span class='author'>${props.author}</span>\n        <span class='spacy time'>${(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.formatTime)(props.date)}</span>\n        ${!isToday(props.date) && _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<span class='spacy time'>${(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.formatDate)(props.date)}</span>`}\n      </div>`}\n      <div class=${['content', ...(isOnlyEmoji(props.content) ? ['emoji'] : [])].join(' ')}>${build(props.content)}</div>\n      ${props.info && _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<div class=${['info', props.info.type].join(' ')}>${props.info.msg}</div>`}\n    </div>\n  </div>\n`;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/message.js?");

/***/ }),

/***/ "./src/js/components/messageList.js":
/*!******************************************!*\
  !*** ./src/js/components/messageList.js ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MessageList\": () => (/* binding */ MessageList)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n/* harmony import */ var _store_messages_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/messages.js */ \"./src/js/store/messages.js\");\n/* harmony import */ var _message_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./message.js */ \"./src/js/components/message.js\");\n/* harmony import */ var _notification_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./notification.js */ \"./src/js/components/notification.js\");\n/* harmony import */ var _services_messages_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/messages.js */ \"./src/js/services/messages.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _store_messages_js__WEBPACK_IMPORTED_MODULE_1__, _message_js__WEBPACK_IMPORTED_MODULE_2__, _notification_js__WEBPACK_IMPORTED_MODULE_3__, _services_messages_js__WEBPACK_IMPORTED_MODULE_4__]);\n([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _store_messages_js__WEBPACK_IMPORTED_MODULE_1__, _message_js__WEBPACK_IMPORTED_MODULE_2__, _notification_js__WEBPACK_IMPORTED_MODULE_3__, _services_messages_js__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nconst loadPrev = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createCooldown)(_services_messages_js__WEBPACK_IMPORTED_MODULE_4__.loadPrevious, 100);\n\nfunction MessageList() {\n  const [messages, setMessages] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useState)([]);\n  const list = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);\n  const stop = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);\n\n  const getH = () => parseInt(window.getComputedStyle(list.current).height.split(' ')[0], 10);\n\n  function onScroll(e) {\n    const msgs = [...list.current.querySelectorAll('.message')];\n    const H = getH();\n    const current = msgs.find((el) => (el.offsetTop-H+ 20 < e.srcElement.scrollTop));\n\n    const top = e.srcElement.scrollHeight - H + e.srcElement.scrollTop;\n    if (top < 10) {\n      loadPrev();\n    } else if (current) {\n      const id = current.getAttribute('data-id');\n      (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_1__.deleteBefore)(id);\n    }\n  }\n\n  (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {\n    list.current.addEventListener('scroll', onScroll);\n    return () => list.current.removeEventListener('scroll', onScroll);\n  }, []);\n\n  (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_1__.watchMessages)((m) => {\n    setMessages([...(m || [])]); // fixme: hack for refreshing\n  });\n\n\n  let prev;\n  return _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n    <div class=\"message-list\" ref=${list}>\n      <div key='bottom' id='scroll-stop' ref=${stop}></div>\n      ${messages.map((msg) => {\n        const sameUser = prev \n          && prev?.user?.id === msg?.user?.id \n          && ( new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;\n        prev = msg;\n        return (\n          msg.notif\n          ? _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<${_notification_js__WEBPACK_IMPORTED_MODULE_3__.Notification} \n              key=${msg.id}\n              className=${[msg.notifType]}>\n              ${msg.notif}\n            <//>`\n          : _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n          <${_message_js__WEBPACK_IMPORTED_MODULE_2__.Message} \n            class=${msg.priv ? ['private'] : []} \n            data-id=${msg.id}\n            key=${msg.id}\n            sameUser=${sameUser}\n            avatarUrl=${msg.user?.avatarUrl}\n            author=${msg.user?.name || 'Guest'}\n            info=${msg.info}\n            content=${msg.message}\n            date=${msg.createdAt}\n          />`\n        );\n      }).reverse()}\n    </div>\n  `;\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/messageList.js?");

/***/ }),

/***/ "./src/js/components/notification.js":
/*!*******************************************!*\
  !*** ./src/js/components/notification.js ***!
  \*******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Notification\": () => (/* binding */ Notification)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__]);\n_utils_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst Notification = ({ children, className = [], ...props }) => _utils_js__WEBPACK_IMPORTED_MODULE_0__.html`\n  <div ...${props} class=${['notification', ...className].join(' ')}>\n    ${children}\n  </div>\n`;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/components/notification.js?");

/***/ }),

/***/ "./src/js/connection.js":
/*!******************************!*\
  !*** ./src/js/connection.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _requests_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./requests.js */ \"./src/js/requests.js\");\n\n\nconst handlers = {};\nconst notify = (ev, ...args) => Promise.all((handlers[ev] || []).map(async (h) => {\n  try { \n    await h(...args)\n  } catch(err) {\n    console.error(err);\n  }\n}));\n// eslint-disable-next-line no-return-assign\nconst watch = (ev, fn) => (handlers[ev] = handlers[ev] || []).push(fn);\nlet conPromise = null;\n\nconst connect = () => {\n  conPromise = new Promise((resolve) => {\n    let protocol = 'ws:';\n    if (document.location.protocol === 'https:') {\n      protocol = 'wss:';\n    }\n    const ws = new WebSocket(`${protocol}//${document.location.host}/ws`);\n    //const ws = new WebSocket(`wss://chat.codecat.io/ws`);\n    ws.addEventListener('message', (raw) => {\n      try {\n        notify('packet', srv, raw);\n        const msg = JSON.parse(raw.data);\n        console.log('recv',msg);\n        if (msg.resp) notify('resp', srv, msg);\n        else if (msg.op) notify(`op:${msg.op.type}`, srv, msg);\n        else notify('message', srv, msg);\n      } catch (err) {\n        notify('packet:error', srv, raw, err);\n        // eslint-disable-next-line no-console\n        console.error(err);\n      }\n    });\n    ws.addEventListener('open', () => resolve(ws));\n    ws.addEventListener('close', () => {\n      notify('disconnect', srv);\n      setTimeout(() => connect(), 1000);\n    });\n  }).then((ws) => {\n    notify('ready', srv);\n    return ws;\n  });\n};\n\nconst getCon = async () => {\n  const con = await conPromise;\n  if (con.readyState === 1) return con;\n  return new Promise((resolve) => { setTimeout(() => getCon().then(resolve), 100); });\n};\n\nconst srv = {\n  send: async (msg) => {\n    console.log('send',msg);\n    msg._raw = msg._raw ? msg._raw : JSON.stringify(msg);\n    const con = await getCon();\n    notify('beforeSend', srv, msg);\n    return con.send(msg._raw);\n  },\n  on: (...arg) => {\n    watch(...arg);\n    return srv;\n  },\n  init: () => {\n    connect();\n    return srv;\n  }\n};\n(0,_requests_js__WEBPACK_IMPORTED_MODULE_0__.initRequests)(srv);\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (srv);\n\n\n//# sourceURL=webpack://quack/./src/js/connection.js?");

/***/ }),

/***/ "./src/js/core.js":
/*!************************!*\
  !*** ./src/js/core.js ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _store_config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store/config.js */ \"./src/js/store/config.js\");\n/* harmony import */ var _store_channel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store/channel.js */ \"./src/js/store/channel.js\");\n/* harmony import */ var _store_session_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/session.js */ \"./src/js/store/session.js\");\n/* harmony import */ var _store_info_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./store/info.js */ \"./src/js/store/info.js\");\n/* harmony import */ var _store_user_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./store/user.js */ \"./src/js/store/user.js\");\n/* harmony import */ var _store_messages_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./store/messages.js */ \"./src/js/store/messages.js\");\n/* harmony import */ var _services_messages_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/messages.js */ \"./src/js/services/messages.js\");\n/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./connection.js */ \"./src/js/connection.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_store_channel_js__WEBPACK_IMPORTED_MODULE_1__, _store_info_js__WEBPACK_IMPORTED_MODULE_3__, _store_user_js__WEBPACK_IMPORTED_MODULE_4__, _store_messages_js__WEBPACK_IMPORTED_MODULE_5__, _services_messages_js__WEBPACK_IMPORTED_MODULE_6__]);\n([_store_channel_js__WEBPACK_IMPORTED_MODULE_1__, _store_info_js__WEBPACK_IMPORTED_MODULE_3__, _store_user_js__WEBPACK_IMPORTED_MODULE_4__, _store_messages_js__WEBPACK_IMPORTED_MODULE_5__, _services_messages_js__WEBPACK_IMPORTED_MODULE_6__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\n_connection_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"].on('ready', connectionReady)\n  .on('ready', (srv) => !(0,_store_session_js__WEBPACK_IMPORTED_MODULE_2__.getSession)() && srv.send({ op: { type: 'greet' } }))\n  .on('packet', (srv, raw) => {\n    const msg = JSON.parse(raw.data);\n    // eslint-disable-next-line no-console\n    if (window.debug && msg.op) console.log(msg.op.type, msg.op);\n  })\n  .on('op:setSession', handleSession)\n  .on('op:setConfig', (srv, msg) => (0,_store_config_js__WEBPACK_IMPORTED_MODULE_0__.setConfig)(msg.op.config))\n  .on('op:setChannel', handleChannel)\n  .on('op:typing', (srv, msg) => msg.user.id !== (0,_store_user_js__WEBPACK_IMPORTED_MODULE_4__.getUser)().id && (0,_store_info_js__WEBPACK_IMPORTED_MODULE_3__.setInfo)({ msg: `${msg.user.name} is typing`, type: 'info' }, 1000))\n  .on('message', handleMessage)\n  .on('disconnect', () => {\n    (0,_store_info_js__WEBPACK_IMPORTED_MODULE_3__.setInfo)({ msg: 'Disconnected - reconnect attempt in 1s', type: 'error' });\n  })\n  .init();\n\nsetInterval(async () => {\n  const start = new Date();\n  try {\n    await _connection_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"].req({ op: { type: 'ping' } });\n  } catch (err) {\n    // eslint-disable-next-line no-console\n    console.error(err);\n  } finally {\n    if (window.debug) {\n      (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_5__.insertMessage)({ notifType: 'debug', notif: `Ping: ${new Date() - start}ms`, createdAt: new Date() });\n    }\n  }\n}, 10000);\n\nwindow.addEventListener('hashchange', () => {\n  const name = window.location.hash.slice(1);\n  _connection_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"].send({ command: { name: 'channel', args: [name] } });\n}, false);\n\nasync function connectionReady(srv) {\n  (0,_store_info_js__WEBPACK_IMPORTED_MODULE_3__.setInfo)(null);\n  try {\n    const session = (0,_store_session_js__WEBPACK_IMPORTED_MODULE_2__.getSession)();\n    if (session) {\n      await srv.req({ op: { type: 'restore', session } });\n    }\n  } catch (err) {\n    // eslint-disable-next-line no-console\n    console.error(err);\n    (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_5__.insertMessage)({ notifType: 'warning', notif: 'User session not restored', createdAt: new Date() });\n  }\n}\n\nasync function handleSession(srv, msg) {\n  (0,_store_session_js__WEBPACK_IMPORTED_MODULE_2__.setSession)(msg.op.session);\n  (0,_store_user_js__WEBPACK_IMPORTED_MODULE_4__.setUser)(msg.op.user);\n  await subscribeNotifications();\n  (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_5__.clearMessages)();\n  await (0,_services_messages_js__WEBPACK_IMPORTED_MODULE_6__.load)();\n}\n\nfunction handleMessage(srv, msg) {\n  if (msg.channel === (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.getChannel)()) {\n    (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_5__.insertMessage)(msg);\n  }\n}\n\nfunction handleChannel(srv, msg) {\n  clear();\n  (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.setChannel)(msg.op.channel);\n  (0,_services_messages_js__WEBPACK_IMPORTED_MODULE_6__.load)();\n}\n\nasync function subscribeNotifications() {\n  if ('serviceWorker' in navigator) {\n    await navigator.serviceWorker.ready.then(async (reg) => {\n      const cfg = await (0,_store_config_js__WEBPACK_IMPORTED_MODULE_0__.getConfig)();\n      reg.pushManager.subscribe({\n        userVisibleOnly: true,\n        applicationServerKey: cfg.applicationServerKey,\n      }).then((subscription) => _connection_js__WEBPACK_IMPORTED_MODULE_7__[\"default\"].req({\n        op: {\n          type: 'setupPushNotifications',\n          subscription,\n        },\n      // eslint-disable-next-line no-console\n      })).catch((e) => console.error(e));\n    });\n  }\n}\n\nfunction clear() {\n  (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_5__.clearMessages)();\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/core.js?");

/***/ }),

/***/ "./src/js/formatter.js":
/*!*****************************!*\
  !*** ./src/js/formatter.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"build\": () => (/* binding */ build)\n/* harmony export */ });\nfunction build(data) {\n  if (isEmpty(data)) {\n    return;\n  }\n  const line = data.ops[0].insert;\n  if (typeof line === 'string' && line.startsWith('/')) {\n    const m = line.replace('\\n', '').slice(1).split(' ');\n    return { command: { name: m[0], args: m.splice(1) } };\n  }\n\n  let norm = normalize(data);\n  norm = applyInline(norm);\n  norm = groupLines(norm);\n  norm = applyLineModifiers(norm);\n  norm = applyMultilineModifiers(norm);\n  return { message: norm };\n}\n\nfunction applyMultilineModifiers(lines) {\n  const groups = [];\n  const last = () => (groups.length ? groups[groups.length - 1] : {});\n  lines.forEach((line) => {\n    if (!line.attributes) return groups.push(line);\n    return Object.keys(line.attributes || {}).forEach((attr) => {\n      switch (attr) {\n      case 'list':\n        if (last()[line.attributes[attr]]) last()[line.attributes[attr]].push(line);\n        else groups.push({ [line.attributes[attr]]: [line] });\n        return;\n      case 'code-block':\n      case 'blockquote':\n        if (last()[attr]) last()[attr].push(line);\n        else groups.push({ [attr]: [line] });\n        return;\n      default: groups.push(line);\n      }\n    });\n  });\n  return groups;\n}\n\nfunction applyLineModifiers(lines) {\n  return lines.map((line) => Object.keys(line.attributes || {}).reduce((acc, attr) => {\n    switch (attr) {\n    case 'list': return { attributes: line.attributes, item: acc.line };\n    default: return acc;\n    }\n  }, line));\n}\n\nfunction applyInline(ops) {\n  return ops.map((op) => {\n    if (op.insert === '\\n') return { attributes: op.attributes, text: op.insert };\n    const { attributes, insert, ...rest } = op;\n    return Object.keys(attributes || {}).reduce((acc, attr) => {\n      switch (attr) {\n      case 'bold': return { bold: acc };\n      case 'code': return { code: acc };\n      case 'italic': return { italic: acc };\n      case 'strike': return { strike: acc };\n      case 'underline': return { underline: acc };\n      case 'link': return { link: { children: acc, href: attributes.link } };\n      default: return acc;\n      }\n    }, { ...rest, text: insert });\n  });\n}\n\nfunction groupLines(ops) {\n  const lines = [];\n  let group = { line: [] };\n  ops.forEach((item) => {\n    if (item.text === '\\n') {\n      if (item.attributes) group.attributes = item.attributes;\n      lines.push(group);\n      group = { line: [] };\n    } else {\n      group.line.push(item);\n    }\n  });\n  if (group.length > 0) lines.push(group);\n  return lines;\n}\n\nfunction normalize(data) {\n  return data.ops.map((op) => splitLines(op)).flat();\n}\n\nfunction splitLines(op) {\n  if (typeof op.insert === 'string') {\n    return separate({ ...op, insert: '\\n' }, op.insert.split('\\n')\n      .map((l) => ({ ...op, insert: l }))\n      .flat()).filter((item) => item.insert !== '');\n  }\n  return op.insert;\n}\n\nfunction separate(separator, arr) {\n  const newArr = arr.map((item) => [item, separator]).flat();\n  if (newArr.length > 0) newArr.length -= 1;\n  return newArr;\n}\n\nfunction isEmpty(data) {\n  return data.ops.length === 1 && data.ops[0].insert === '\\n';\n}\n\n\n//# sourceURL=webpack://quack/./src/js/formatter.js?");

/***/ }),

/***/ "./src/js/init.js":
/*!************************!*\
  !*** ./src/js/init.js ***!
  \************************/
/***/ (() => {

eval("/* eslint-disable no-console */\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js', {\n    scope: '/',\n  }).then((reg) => {\n    console.log('SW zarejestrowany! Scope:', reg.scope);\n  }).catch((err) => {\n    console.log('Service Worker registration failed: ', err);\n  });\n\n  if ('Notification' in window && navigator.serviceWorker) {\n    Notification.requestPermission((status) => {\n      console.log('Notification permission status:', status);\n    });\n  }\n}\n\n(async () => {\n  window.EMOJI = [];\n  const res = await fetch('/assets/emoji_list.json');\n  window.EMOJI = await res.json();\n})();\n\n\n//# sourceURL=webpack://quack/./src/js/init.js?");

/***/ }),

/***/ "./src/js/pages/chat.js":
/*!******************************!*\
  !*** ./src/js/pages/chat.js ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\n/* harmony import */ var _components_chat_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/chat.js */ \"./src/js/components/chat.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _components_chat_js__WEBPACK_IMPORTED_MODULE_1__]);\n([_utils_js__WEBPACK_IMPORTED_MODULE_0__, _components_chat_js__WEBPACK_IMPORTED_MODULE_1__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n(0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.render)(_utils_js__WEBPACK_IMPORTED_MODULE_0__.html`<${_components_chat_js__WEBPACK_IMPORTED_MODULE_1__.Chat}/>`, document.getElementById('root'));\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/pages/chat.js?");

/***/ }),

/***/ "./src/js/requests.js":
/*!****************************!*\
  !*** ./src/js/requests.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initRequests\": () => (/* binding */ initRequests)\n/* harmony export */ });\nconst waiting = {};\nconst register = (seqId, source) => {\n  let timeout = null;\n  return new Promise((resolve, reject) => {\n    timeout = setTimeout(() => {\n      delete waiting[seqId];\n      const err = new Error('TIMEOUT');\n      Object.assign(err, { seqId: source.id, resp: { status: 'timeout', source } });\n      reject(err);\n    }, 5000);\n    waiting[seqId] = (msg) => {\n      msg.source = source;\n      clearTimeout(timeout);\n      if (msg.resp.status === 'ok') {\n        resolve(msg);\n      } else {\n        reject(msg);\n      }\n    };\n  });\n};\nconst done = (msg) => waiting[msg.seqId] && waiting[msg.seqId](msg);\n\nfunction initRequests(con) {\n  con.on('resp', (srv, msg) => done(msg));\n\n  const ID = (Math.random() + 1).toString(36);\n  let nextSeq = 0;\n\n  const genSeqId = () => `${ID}:${nextSeq++}`;\n\n  const req = async (msg) => {\n    if (!msg.seqId) {\n      msg.seqId = genSeqId();\n    }\n    con.send(msg);\n    return register(msg.seqId, msg);\n  };\n\n  Object.assign(con, { ID, req, genSeqId });\n}\n\n\n//# sourceURL=webpack://quack/./src/js/requests.js?");

/***/ }),

/***/ "./src/js/services/messages.js":
/*!*************************************!*\
  !*** ./src/js/services/messages.js ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"load\": () => (/* binding */ load),\n/* harmony export */   \"loadNext\": () => (/* binding */ loadNext),\n/* harmony export */   \"loadPrevious\": () => (/* binding */ loadPrevious),\n/* harmony export */   \"send\": () => (/* binding */ send),\n/* harmony export */   \"sendCommand\": () => (/* binding */ sendCommand)\n/* harmony export */ });\n/* harmony import */ var _store_messages_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../store/messages.js */ \"./src/js/store/messages.js\");\n/* harmony import */ var _store_channel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../store/channel.js */ \"./src/js/store/channel.js\");\n/* harmony import */ var _store_user_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../store/user.js */ \"./src/js/store/user.js\");\n/* harmony import */ var _connection_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../connection.js */ \"./src/js/connection.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_store_messages_js__WEBPACK_IMPORTED_MODULE_0__, _store_channel_js__WEBPACK_IMPORTED_MODULE_1__, _store_user_js__WEBPACK_IMPORTED_MODULE_2__]);\n([_store_messages_js__WEBPACK_IMPORTED_MODULE_0__, _store_channel_js__WEBPACK_IMPORTED_MODULE_1__, _store_user_js__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\nconst loadPrevious = () => _connection_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].req({ op: { type: 'load', channel: (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.getChannel)(), before: (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.getEarliestDate)() } });\nconst loadNext = () => _connection_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].req({ op: { type: 'load', channel: (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.getChannel)(), after: (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.getLatestDate)() } });\nconst load = () => _connection_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].req({ op: { type: 'load', channel: (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.getChannel)() } });\n\nconst createCounter = (prefix) => {\n  let counter = 0;\n  return () => `${prefix}:${counter++}`;\n};\n\nconst tempId = createCounter(`temp:${(Math.random() + 1).toString(36)}`);\n\nconst send = async (msg) => {\n  if (msg.command) return sendCommand(msg);\n  sendMessage(msg);\n};\n\nconst sendCommand = async (msg) => {\n  const id = tempId();\n  (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.insertMessage)({\n    id, notifType: 'info', notif: `${msg.command.name} sent`, createdAt: new Date(),\n  });\n  try {\n    await _connection_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].req(msg);\n    (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.insertMessage)({\n      id, notifType: 'success', notif: `${msg.command.name} executed successfully`, createdAt: new Date(),\n    });\n  } catch (errr) {\n    (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.insertMessage)({\n      id, notifType: 'error', notif: `${msg.command.name} error`, createdAt: new Date(),\n    });\n  }\n};\n\nconst sendMessage = async (msg) => {\n  const user = (0,_store_user_js__WEBPACK_IMPORTED_MODULE_2__.getUser)();\n  if (!user) {\n    (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.insertMessage)({\n      id: 'login', notifType: 'warning', notif: 'You must login first!', createdAt: new Date(),\n    });\n    return;\n  }\n  msg.channel = (0,_store_channel_js__WEBPACK_IMPORTED_MODULE_1__.getChannel)();\n  msg.clientId = tempId();\n  msg.user = (0,_store_user_js__WEBPACK_IMPORTED_MODULE_2__.getUser)();\n  msg.createdAt = new Date();\n  (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.insertMessage)(msg);\n  try {\n    await _connection_js__WEBPACK_IMPORTED_MODULE_3__[\"default\"].req(msg);\n  } catch (errr) {\n    (0,_store_messages_js__WEBPACK_IMPORTED_MODULE_0__.updateMessage)(msg.clientId, { info: { msg: 'Sending message failed', type: 'error' } });\n  }\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/services/messages.js?");

/***/ }),

/***/ "./src/js/store/channel.js":
/*!*********************************!*\
  !*** ./src/js/store/channel.js ***!
  \*********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getChannel\": () => (/* binding */ getChannel),\n/* harmony export */   \"setChannel\": () => (/* binding */ setChannel),\n/* harmony export */   \"watchChannel\": () => (/* binding */ watchChannel)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__]);\n_utils_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst { notify, watch } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createNotifier)();\n\nlet channel = window.location.hash.slice(1) || 'main';\n\nconst getChannel = () => channel;\n\nconst setChannel = (c) => {\n  channel = c;\n  notify(channel);\n};\n\nconst watchChannel = watch;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/store/channel.js?");

/***/ }),

/***/ "./src/js/store/config.js":
/*!********************************!*\
  !*** ./src/js/store/config.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getConfig\": () => (/* binding */ getConfig),\n/* harmony export */   \"setConfig\": () => (/* binding */ setConfig)\n/* harmony export */ });\nlet set = null;\nconst config = new Promise((resolve) => { set = resolve; });\n\nconst getConfig = () => config;\nconst setConfig = (c) => set(c);\n\n\n//# sourceURL=webpack://quack/./src/js/store/config.js?");

/***/ }),

/***/ "./src/js/store/info.js":
/*!******************************!*\
  !*** ./src/js/store/info.js ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getInfo\": () => (/* binding */ getInfo),\n/* harmony export */   \"setInfo\": () => (/* binding */ setInfo),\n/* harmony export */   \"watchInfo\": () => (/* binding */ watchInfo)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__]);\n_utils_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst { notify, watch } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createNotifier)();\n\nlet info = null;\nlet timeout = null;\n\nconst watchInfo = watch;\n\nconst getInfo = () => info;\n\nfunction setInfo(c, dur) {\n  if (timeout) {\n    clearTimeout(timeout);\n  }\n  info = c;\n  notify(info);\n  if (dur) {\n    timeout = setTimeout(() => setInfo(null), dur);\n  }\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/store/info.js?");

/***/ }),

/***/ "./src/js/store/messages.js":
/*!**********************************!*\
  !*** ./src/js/store/messages.js ***!
  \**********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"clearMessages\": () => (/* binding */ clearMessages),\n/* harmony export */   \"deleteBefore\": () => (/* binding */ deleteBefore),\n/* harmony export */   \"getEarliestDate\": () => (/* binding */ getEarliestDate),\n/* harmony export */   \"getLatestDate\": () => (/* binding */ getLatestDate),\n/* harmony export */   \"getMessage\": () => (/* binding */ getMessage),\n/* harmony export */   \"getMessages\": () => (/* binding */ getMessages),\n/* harmony export */   \"insertMessage\": () => (/* binding */ insertMessage),\n/* harmony export */   \"removeMessage\": () => (/* binding */ removeMessage),\n/* harmony export */   \"updateMessage\": () => (/* binding */ updateMessage),\n/* harmony export */   \"watchMessages\": () => (/* binding */ watchMessages)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__]);\n_utils_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst { notify, watch } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createNotifier)();\n\nlet list = [];\n\nconst getEarliestDate = () => (list.length ? list[0].createdAt : new Date());\n\nconst getLatestDate = () => (list.length ? list[list.length - 1].createdAt : new Date());\n\nconst getMessage = (id) => list.find((m) => m.id === id || m.clientId === id);\nconst getMessages = () => list;\n\nconst insertMessage = (msg) => {\n  console.log(msg);\n  msg.createdAt = new Date(msg.createdAt);\n  const existing = list.find((m) => (m.id && m.id === msg.id)\n    || (m.clientId && m.clientId === msg.clientId));\n  if (existing) {\n    Object.assign(existing, msg);\n    return notify(list);\n  }\n  let pos = list.findIndex((m) => m.createdAt > msg.createdAt);\n  if (pos === -1 && list.some((m) => m.createdAt < msg.createdAt)) pos = list.length;\n  list = [\n    ...list.slice(0, pos),\n    msg,\n    ...list.slice(pos),\n  ];\n  notify(list);\n};\n\nconst removeMessage = (id) => {\n  if (!id) return;\n  const pos = list.findIndex((m) => m.id === id || m.clientId === id);\n  if (pos === -1) return;\n  list = [\n    ...list.slice(0, pos),\n    ...list.slice(pos + 1),\n  ];\n  notify(list);\n};\n\nconst updateMessage = (id, data) => {\n  if (!id) return;\n  const existing = list.find((m) => m.id === id || m.clientId === id);\n  if (!existing) return;\n  Object.assign(existing, data);\n  notify(list);\n};\n\nconst SPAN = 50;\n\nconst deleteBefore = (id) => {\n  if (!id) return;\n  const len = list.length;\n  const idx = list.findIndex((m) => m.id === id || m.clientId === id);\n  if (idx === -1) return;\n  if (idx - SPAN <= 0) return;\n  list = [\n    ...list.slice(idx - SPAN, idx),\n    ...list.slice(idx),\n  ];\n  if (len !== list.length) {\n    notify(list);\n  }\n};\n\nconst clearMessages = async () => {\n  list = [];\n  notify(list);\n};\n\nconst watchMessages = watch;\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/store/messages.js?");

/***/ }),

/***/ "./src/js/store/session.js":
/*!*********************************!*\
  !*** ./src/js/store/session.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"clearSession\": () => (/* binding */ clearSession),\n/* harmony export */   \"getSession\": () => (/* binding */ getSession),\n/* harmony export */   \"setSession\": () => (/* binding */ setSession)\n/* harmony export */ });\nconst getSession = () => {\n  try {\n    return JSON.parse(localStorage.getItem('session'));\n  } catch (err) {\n    // eslint-disable-next-line no-console\n    console.error(err);\n    return null;\n  }\n};\n\nconst setSession = (session) => {\n  localStorage.setItem('session', JSON.stringify(session));\n};\n\nconst clearSession = () => {\n  localStorage.removeItem('session');\n};\n\n\n//# sourceURL=webpack://quack/./src/js/store/session.js?");

/***/ }),

/***/ "./src/js/store/user.js":
/*!******************************!*\
  !*** ./src/js/store/user.js ***!
  \******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getUser\": () => (/* binding */ getUser),\n/* harmony export */   \"setUser\": () => (/* binding */ setUser),\n/* harmony export */   \"watchUser\": () => (/* binding */ watchUser)\n/* harmony export */ });\n/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils.js */ \"./src/js/utils.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_utils_js__WEBPACK_IMPORTED_MODULE_0__]);\n_utils_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\nconst { notify, watch } = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.createNotifier)();\n\nlet user = null;\n\nconst watchUser = watch;\n\nconst getUser = () => user;\n\nfunction setUser(u) {\n  user = u;\n  notify(user);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/store/user.js?");

/***/ }),

/***/ "./src/js/utils.js":
/*!*************************!*\
  !*** ./src/js/utils.js ***!
  \*************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Component\": () => (/* binding */ Component),\n/* harmony export */   \"createCooldown\": () => (/* binding */ createCooldown),\n/* harmony export */   \"createCounter\": () => (/* binding */ createCounter),\n/* harmony export */   \"createNotifier\": () => (/* binding */ createNotifier),\n/* harmony export */   \"formatDate\": () => (/* binding */ formatDate),\n/* harmony export */   \"formatTime\": () => (/* binding */ formatTime),\n/* harmony export */   \"h\": () => (/* binding */ h),\n/* harmony export */   \"html\": () => (/* binding */ html),\n/* harmony export */   \"render\": () => (/* binding */ render),\n/* harmony export */   \"useEffect\": () => (/* binding */ useEffect),\n/* harmony export */   \"useMemo\": () => (/* binding */ useMemo),\n/* harmony export */   \"useRef\": () => (/* binding */ useRef),\n/* harmony export */   \"useState\": () => (/* binding */ useState)\n/* harmony export */ });\n/* harmony import */ var https_unpkg_com_preact_latest_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! https://unpkg.com/preact@latest?module */ \"https://unpkg.com/preact@latest?module\");\n/* harmony import */ var https_unpkg_com_htm_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! https://unpkg.com/htm?module */ \"https://unpkg.com/htm?module\");\n/* harmony import */ var https_unpkg_com_preact_latest_hooks_dist_hooks_module_js_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module */ \"https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([https_unpkg_com_preact_latest_module__WEBPACK_IMPORTED_MODULE_0__, https_unpkg_com_htm_module__WEBPACK_IMPORTED_MODULE_1__, https_unpkg_com_preact_latest_hooks_dist_hooks_module_js_module__WEBPACK_IMPORTED_MODULE_2__]);\n([https_unpkg_com_preact_latest_module__WEBPACK_IMPORTED_MODULE_0__, https_unpkg_com_htm_module__WEBPACK_IMPORTED_MODULE_1__, https_unpkg_com_preact_latest_hooks_dist_hooks_module_js_module__WEBPACK_IMPORTED_MODULE_2__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n/* eslint-disable import/no-unresolved */\n\n\n\n\nconst {\n  useEffect, useState, useMemo, useRef,\n} = https_unpkg_com_preact_latest_hooks_dist_hooks_module_js_module__WEBPACK_IMPORTED_MODULE_2__;\nconst { Component } = https_unpkg_com_preact_latest_module__WEBPACK_IMPORTED_MODULE_0__;\nconst { render } = https_unpkg_com_preact_latest_module__WEBPACK_IMPORTED_MODULE_0__;\nconst { h } = https_unpkg_com_preact_latest_module__WEBPACK_IMPORTED_MODULE_0__;\n\nconst formatDate = (raw) => {\n  const date = new Date(raw);\n  return date.toLocaleDateString('pl-PL');\n};\n\nconst formatTime = (raw) => {\n  const date = new Date(raw);\n  let minutes = date.getMinutes().toString();\n  if (minutes.length === 1) minutes = `0${minutes}`;\n  return `${date.getHours()}:${minutes}`;\n};\nconst html = https_unpkg_com_htm_module__WEBPACK_IMPORTED_MODULE_1__[\"default\"].bind(h);\n\nconst createCounter = (prefix) => {\n  let counter = 0;\n  return () => `${prefix}:${counter++}`;\n};\n\nconst createNotifier = () => {\n  const listeners = [];\n  let cooldown = null;\n\n  const notify = (data) => {\n    if (cooldown) clearTimeout(cooldown);\n    cooldown = setTimeout(() => listeners.forEach((l) => l(data)), 10);\n  };\n  const watch = (handler) => listeners.push(handler);\n\n  return { notify, watch };\n};\n\nconst createCooldown = (fn, time) => {\n  let cooldown = false;\n  return async () => {\n    if (!cooldown) {\n      cooldown = true;\n      setTimeout(() => { cooldown = false; }, time);\n      return fn();\n    }\n  };\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://quack/./src/js/utils.js?");

/***/ }),

/***/ "https://unpkg.com/htm?module":
/*!***********************************************!*\
  !*** external "https://unpkg.com/htm?module" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("https://unpkg.com/htm?module");;

/***/ }),

/***/ "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module":
/*!************************************************************************************!*\
  !*** external "https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module" ***!
  \************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module");;

/***/ }),

/***/ "https://unpkg.com/preact@latest?module":
/*!*********************************************************!*\
  !*** external "https://unpkg.com/preact@latest?module" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("https://unpkg.com/preact@latest?module");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackThen = typeof Symbol === "function" ? Symbol("webpack then") : "__webpack_then__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var completeQueue = (queue) => {
/******/ 			if(queue) {
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var completeFunction = (fn) => (!--fn.r && fn());
/******/ 		var queueFunction = (queue, fn) => (queue ? queue.push(fn) : completeFunction(fn));
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackThen]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						completeQueue(queue);
/******/ 						queue = 0;
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						completeQueue(queue);
/******/ 						queue = 0;
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackThen] = (fn, reject) => (queueFunction(queue, fn), dep['catch'](reject));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackThen] = (fn) => (completeFunction(fn));
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue = hasAwait && [];
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var isEvaluating = true;
/******/ 			var nested = false;
/******/ 			var whenAll = (deps, onResolve, onReject) => {
/******/ 				if (nested) return;
/******/ 				nested = true;
/******/ 				onResolve.r += deps.length;
/******/ 				deps.map((dep, i) => (dep[webpackThen](onResolve, onReject)));
/******/ 				nested = false;
/******/ 			};
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = () => (resolve(exports), completeQueue(queue), queue = 0);
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackThen] = (fn, rejectFn) => {
/******/ 				if (isEvaluating) { return completeFunction(fn); }
/******/ 				if (currentDeps) whenAll(currentDeps, fn, rejectFn);
/******/ 				queueFunction(queue, fn);
/******/ 				promise['catch'](rejectFn);
/******/ 			};
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve, reject) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					whenAll(currentDeps, fn, reject);
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => (err && reject(promise[webpackError] = err), outerResolve()));
/******/ 			isEvaluating = false;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;