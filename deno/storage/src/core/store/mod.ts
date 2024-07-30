import { Config } from '@quack/config';
import { files as fs } from './fs.ts';
import { files as gcs } from './gcs.ts';
import { files as memory } from './memory.ts';

export const files = (config: Config['storage']) => {
  switch (config.type) {
    case 'fs':
      return fs(config);
    case 'gcs':
      return gcs(config);
    case 'memory':
      return memory(config);
    default:
      throw new Error('Invalid storage');
  }
}
