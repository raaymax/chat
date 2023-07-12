/// <reference types="node" />
//
export type Config = {
  vapid: {
    publicKey: string,
    privateKey: string,
  },
  sessionSecret: string,
  port: number,
  databaseUrl: string,
  cors: string[],
  storage: {
    type: 'fs' | 'gcs' | 'memory',
    bucket?: string,
    directory?: string,
  },
  baseUrl: string,
};
