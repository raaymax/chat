import { logger } from '../core';

export const logErrors = (func, errHandler = (a) => a) => (...args) => {
  try {
    const ret = func(...args);
    if (ret instanceof Promise) {
      return ret.catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        logger.error(e);
        errHandler(e);
      });
    }
    return ret;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    logger.error(e);
    errHandler(e);
  }
}

export {logger}
