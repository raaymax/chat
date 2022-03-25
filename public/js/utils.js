import * as preact from 'https://unpkg.com/preact@latest?module';
import htm from 'https://unpkg.com/htm?module';
import * as hooks from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

export const {useEffect, useState, useMemo, useRef} = hooks;
export const Component = preact.Component;
export const render = preact.render;
export const h = preact.h;

export const formatTime = (raw) => {
  const date = new Date(raw);
	let minutes = date.getMinutes().toString();
	if(minutes.length == 1) minutes = `0${minutes}`;
  return `${date.getHours()}:${minutes}`
} 
export const html = htm.bind(h);
