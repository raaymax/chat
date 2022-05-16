/* eslint-disable import/no-unresolved */
import * as preact from 'preact';
import * as hooks from 'preact/hooks';

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
  const watch = (handler) => {
    listeners.push(handler);
    return () => listeners.splice(listeners.indexOf(handler), 1);
  }

  return [notify, watch];
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
  const notify = (ev, ...args) => {
    if (!handlers[ev] || handlers[ev].length === 0) {
      // eslint-disable-next-line no-console
      console.log('Event not handled', ev, args);
    }
    return Promise.all(
      (handlers[ev] || [])
        .map(async (listener) => {
          try {
            await listener(...args);
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err);
          }
        }),
    )
  };
  // eslint-disable-next-line no-return-assign
  const watch = (ev, fn) => {
    (handlers[ev] = handlers[ev] || []).push(fn);
  }
  const once = (ev, fn) => {
    handlers[ev] = handlers[ev] || [];
    const cb = async (...args) => {
      const idx = handlers[ev].findIndex((c) => c === cb);
      handlers[ev].splice(idx, 1);
      return fn(...args)
    }
    handlers[ev].push(cb);
  }

  const exists = (ev) => Array.isArray(handlers[ev]) && handlers[ev].length > 0;

  return {
    watch, once, notify, exists,
  };
};
