import webpush from 'web-push';
import * as path from "@std/path";
import crypto from 'node:crypto';

export type Config = {
  vapid: {
    publicKey: string,
    privateKey: string,
  },
  trustProxy: string | boolean,
  sessionSecret: string,
  port: number,
  databaseUrl: string,
  cors: (string | RegExp)[],
  storage: {
    type: 'gcs',
    bucket: string,
  } | {
    type: 'fs',
    directory: string,
  } | {
    type: 'memory',
  },
  baseUrl: string,
};

const __dirname = path.dirname(path.fromFileUrl(import.meta.url));
const SECRETS_FILE: string = path.join(__dirname, '..', '..', 'secrets.json');
const PORT: number  = parseInt(Deno.env.get('PORT') ?? "8080") || 8080;
const DATABASE_URL = Deno.env.get('DATABASE_URL');
const ENV = Deno.env.get('ENV_TYPE') || Deno.env.get('NODE_ENV');

export const generateSecrets = () => {
  try { 
    const data = Deno.readTextFileSync(SECRETS_FILE);
    return JSON.parse(data);
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      const vapidKeys = webpush.generateVAPIDKeys();
      const secrets = {
        vapid: vapidKeys,
        sessionSecret: crypto.randomBytes(64).toString('hex'),
      }
      Deno.writeTextFileSync(SECRETS_FILE, JSON.stringify(secrets, null, 2));
      return secrets;
    } else {
      console.log("Error reading secrets file", e);
      Deno.exit(1);
    }
  }
};

const defaults: Partial<Config> = {
  port: PORT,
  databaseUrl: DATABASE_URL,
  // https://expressjs.com/en/guide/behind-proxies.html
  trustProxy: 'uniquelocal',
  cors: [
    /https?:\/\/localhost(:[0-9]{,4})?/,
  ],
  storage: {
    type: 'fs',
    directory: path.join(Deno.cwd(), '..', '..', 'uploads'),
  },
  baseUrl: 'http://localhost:8080',
};

const secrets = generateSecrets();

async function load(): Promise<Config> {
  if (ENV === 'test') {
    return importTestConfig();
  }else {
    return loadConfig();
  }
}
async function loadConfig(): Promise<Config> {
  let config;
  const configFiles = [
    'chat.config.ts',
    'chat.config.js',
    'chat.config.mjs',
    'chat.config.json'
  ]

  for await (const file of configFiles) {
    config = await importConfig(file);
    if(config !== null) { 
      break;
    }
  }
  if(config === null) {
    throw new Error('No config file found');
  }

  return {
    ...defaults,
    ...secrets,
    ...config,
  };
}

async function importTestConfig(): Promise<Config> {
  let config;
  const configFiles = [
    'tests/chat.config.tests.ts',
    'tests/chat.config.tests.js',
    'tests/chat.config.tests.mjs',
    'tests/chat.config.tests.json',
  ]

  for await (const file of configFiles) {
    config = await importConfig(file);
    if(config !== null) { 
      break;
    }
  }
  if(config === null) {
    console.log('No test config found, trying to load default config');
    return await loadConfig();
  }

  return {
    ...defaults,
    ...secrets,
    ...config,
  };
}


async function importConfig(file: string): Promise<Config | null> {
  const ext = path.extname(file);
  if (ext === '.ts' || ext === '.js' || ext === '.mjs') {
    return await importScript(file);
  } else if (ext === '.json') {
    return await loadJSON(file);
  } else {
    throw new Error('Internal error: invalid config file extension ' + ext);
  }
}


async function importScript(file: string): Promise<Config | null> {
  try {
    const {default: config} = await import(path.join("..", "..",file));
    return config as Config;
  } catch {
    return null;
  }
}

async function loadJSON(file: string): Promise<Config | null> {
  try {
    return JSON.parse(Deno.readTextFileSync(file));
  } catch {
    return null;
  }
}

let config: Config;
try {
  config = await load();
} catch(e) {
  console.error(e);
  Deno.exit(1);
}

export default config;

if(import.meta.main) {
  console.log(config);
}
