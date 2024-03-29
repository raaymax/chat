const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const formatDate = (raw) => {
  const date = new Date(raw);
  return date.toLocaleDateString('pl-PL');
};

export const formatDateDetailed = (raw) => {
  const date = new Date(raw);
  return `${DAYS[date.getDay()]}, ${date.toLocaleDateString('pl-PL')}`;
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
  };

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
    );
  };
  // eslint-disable-next-line no-return-assign
  const watch = (ev, fn) => {
    (handlers[ev] = handlers[ev] || []).push(fn);
  };
  const once = (ev, fn) => {
    handlers[ev] = handlers[ev] || [];
    const cb = async (...args) => {
      const idx = handlers[ev].findIndex((c) => c === cb);
      handlers[ev].splice(idx, 1);
      return fn(...args);
    };
    handlers[ev].push(cb);
  };

  const exists = (ev) => Array.isArray(handlers[ev]) && handlers[ev].length > 0;

  return {
    watch, once, notify, exists,
  };
};

export const buildEmojiNode = (result, getUrl) => {
  const emoji = (() => {
    if (result.unicode) {
      return document.createTextNode(String.fromCodePoint(parseInt(result.unicode, 16)));
    }
    if (result.fileId) {
      const img = document.createElement('img');
      img.src = getUrl(result.fileId);
      img.alt = result.shortname;
      return img;
    }
  })();
  const node = document.createElement('span');
  node.className = 'emoji';
  node.setAttribute('emoji', result.shortname);
  node.setAttribute('contentEditable', false);
  node.appendChild(emoji);
  return node;
};

export const omitUndefined = (ob) => Object.fromEntries(
  Object.entries(ob).filter(([, v]) => v !== undefined),
);
