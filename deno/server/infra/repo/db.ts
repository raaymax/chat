import { Db, MongoClient } from "mongodb";
export { ObjectId } from "mongodb";

let db: Db | undefined = undefined;
let client: MongoClient | undefined = undefined;
let databaseUrl: string;

export const init = (url: string) => {
  databaseUrl = url;
  client = new MongoClient(databaseUrl);
  return client;
};

export const connect = async () => {
  if (!databaseUrl) throw new Error("Database not initialized");
  if (db && client) return { db, client };
  client = new MongoClient(databaseUrl);
  await client.connect();
  db = client.db();
  return { db, client };
};

export const disconnect = async () => {
  if (client) {
    await client.close();
    db = undefined;
    client = undefined;
  }
};
