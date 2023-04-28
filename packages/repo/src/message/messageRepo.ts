import { Pagination } from '../types';
import Repo from '../repo';
import { Message, MessageQuery, MongoMessage } from './messageTypes';
import { MessageSerializer } from './messageSerializer';
import { ObjectId } from 'mongodb';
import { connect } from '../db';

export class MessageRepo extends Repo<MessageQuery, Message, MongoMessage> {
  constructor() {
    super('messages', new MessageSerializer());
  }
  async getAll(arg: MessageQuery, { limit = 50, offset = 0, order = 1 }: Pagination = {}) {
    const {db} = await connect();
    const query = this.serializer.serializeQuery(arg);

    const raw = await db
      .collection(this.tableName)
      .find(query)
      .sort('createdAt', order)
      .skip(offset)
      .limit(limit)
      .toArray();

    return this.serializer.deserializeModelMany(raw);
  }

  async updateThread({ parentId, userId, id }) {
    const {db} = await connect();
    return db
      .collection<MongoMessage>(this.tableName)
      .updateOne({
        id: new ObjectId(parentId),
      }, {
        $push: {
          thread: {
            userId: new ObjectId(userId),
            childId: new ObjectId(id),
          },
        },
        $set: {
          updatedAt: new Date(),
        },
      });
  }
}
