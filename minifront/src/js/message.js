import {h,t} from '/js/utils.js';

export const message = (params = {}, slots = {}) => {
  return h('div',{...params, class: ['message', ...params.class].join(' ')}, [
    h('div', {class: 'body'}, [
      h('div', {class: 'header'}, [
        h('i', {class: 'fa-regular fa-user'}),
        slots.author,
        h('i', {class: 'fa-regular fa-clock'}),
        slots.date,
        ...(slots.debug ? [h('span', {class: 'toggle-debug'}, [
          h('i', {class: 'fa-regular fa-circle-question'}),
          h('span', {class: 'spacy'}, [t('debug')]),
        ])] : []),
      ]),
      h('div', {class: 'content'}, slots.content ? [slots.content] : []),
      ...(slots.debug ? [h('div', {class: 'debug', style: "display: none;"}, [slots.debug])] : []) 
    ])
  ])
}
