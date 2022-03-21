import * as preact from 'https://unpkg.com/preact@latest?module';
import htm from 'https://unpkg.com/htm?module';
import * as hooks from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

export const {useEffect, useState, useRef} = hooks;
export const Component = preact.Component;
export const render = preact.render;
export const h = preact.h;
//(name, attr = {}, ...children) => {
//  //console.log(name, attr, children);
//  if(attr === null) attr = {};
//  children = children.flat()
//    .filter(c=>typeof c !== 'undefined')
//    .map(c=>typeof c === 'string' ? t(c) : c.cloneNode(true));
//  const el = document.createElement(name);
//  Object.entries(attr)
//    .forEach(([key, val]) => el.setAttribute(key, val));
//  children.forEach(child => el.appendChild(child))
//  return el;
//}
export const t = (text) => document.createTextNode(text);

export const formatTime = (raw) => {
  const date = new Date(raw);
	let minutes = date.getMinutes().toString();
	if(minutes.length == 1) minutes = `0${minutes}`;
  return `${date.getHours()}:${minutes}`
} 
export const html = htm.bind(h);
