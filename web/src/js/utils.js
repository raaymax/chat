/* eslint-disable import/no-unresolved */
import * as preact from 'https://unpkg.com/preact@latest?module';
import htm from 'https://unpkg.com/htm?module';
import * as hooks from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

export const {
  useEffect, useState, useMemo, useRef,
} = hooks;
export const { Component } = preact;
export const { render } = preact;
export const { h } = preact;

export const formatDate = (raw) => {
  const date = new Date(raw);
  return date.toLocaleDateString('pl-PL');
};

export const formatTime = (raw) => {
  const date = new Date(raw);
  let minutes = date.getMinutes().toString();
  if (minutes.length === 1) minutes = `0${minutes}`;
  return `${date.getHours()}:${minutes}`;
};
export const html = htm.bind(h);

export const createCounter = (prefix) => {
  let counter = 0;
  return () => `${prefix}:${counter++}`;
};

export const createNotifier = () => {
  const listeners = [];
  let cooldown = null;

  const notify = (data) => {
    if (cooldown) clearTimeout(cooldown);
    cooldown = setTimeout(() => listeners.forEach((l) => l(data)), 10);
  };
  const watch = (handler) => listeners.push(handler);

  return { notify, watch };
};

export const createCooldown = (fn, time) => {
  let cooldown = false;
  return async () => {
    if (!cooldown) {
      cooldown = true;
      setTimeout(() => { cooldown = false; }, time);
      return fn();
    }
  };
};

export const createEventListener = () => {
  const handlers = {};
  const notify = (ev, ...args) => Promise.all(
    (handlers[ev] || [])
      .map(async (listener) => {
        try {
          await listener(...args);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }),
  );
  // eslint-disable-next-line no-return-assign
  const watch = (ev, fn) => (handlers[ev] = handlers[ev] || []).push(fn);

  return { watch, notify };
};
