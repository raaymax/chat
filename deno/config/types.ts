export type Config = {
  vapid: {
    publicKey: string;
    privateKey: string;
  };
  trustProxy: string | boolean;
  sessionSecret: string;
  port: number;
  databaseUrl: string;
  cors: (string | RegExp)[];
  plugins?: ((app: any, core: any) => Promise<any> | any)[];
  webhooks?: {
    url: string;
    events?: string[];
  }[];
  storage: {
    type: "gcs";
    bucket: string;
  } | {
    type: "fs";
    directory: string;
  } | {
    type: "memory";
  };
  baseUrl: string;
};
