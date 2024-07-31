import { Storage, Config } from '../types';
import createFsStorage from './FsStorage';
import createGcsStorage from './GcsStorage';
import createMemoryStorage from './MemoryStorage';

const getStrategy = (config: Config): ((cfg: Config) => Storage) => {
  switch (config.storage?.type) {
  case 'fs':
    return createFsStorage;
  case 'gcs':
    return createGcsStorage;
  case 'memory':
  default:
    return createMemoryStorage;
  }
};

export default (config: Config): Storage => {
  const Strategy = getStrategy(config);
  return Strategy(config);
};
