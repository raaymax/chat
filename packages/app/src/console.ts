const { log } = console;

// eslint-disable-next-line no-console
console.log = (...args) => {
  log.apply(console, args);
  log.apply(console, [new Error().stack]);
};
