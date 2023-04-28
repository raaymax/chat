import { z } from 'zod';
import { ObjectId, Document, Filter, InsertOneResult, WithId } from 'mongodb';

export const Id = z.custom<string & { __appId: true }>((val) => {
  return /^[a-f0-9]{24,}$/.test(val as string);
});
export const ClientId = z.custom<string & { __clientId: true }>((val) => {
  return /.+/.test(val as string);
});
export type Id = z.infer<typeof Id>;
export type ClientId = z.infer<typeof ClientId>;
export type Uuid = string & { __uuid: true }

export type ReplaceId<T> = T extends { id?: unknown } ? Omit<T, 'id'> & { _id: ObjectId } : T;
export type ReplaceMongoId<T> = T extends { _id?: unknown } ? Omit<T, '_id'> & { id: Id } : T;
export type ReplaceType<T, F, B> = { [P in keyof T]: T[P] extends F ? B : (T[P] extends Array<unknown> ? ReplaceType<T[P], F,B> : (T[P] extends Record<string, unknown> ? ReplaceType<T[P], F, B> : T[P])) };

export type MongoId = {
  _id: ObjectId,
};

export type Pagination = {
  limit?: number,
  offset?: number,
  order?: 1 | -1,
}

export interface Serializer<Query, Model, MongoModel> {
  serializeQuery: (arg: Query) => Filter<MongoModel> | undefined;
  deserializeModel: (arg: WithId<Document>) => Model | null;
  deserializeModelMany: (arg: Array<WithId<Document>>) => Array<Model>;
  serializeModel: (arg: Model) => Document;
  deserializeInsertedId: (arg: InsertOneResult<Document>) => Id | null;
  serializeId: (arg: { id: Id }) => MongoId
}

export type WithoutUndefined<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K]
};

