import { Serializer, MongoId, Id} from '../types';
import { removeUndefined, makeObjectId, makeId } from '../util';
import { ObjectId, Filter, InsertOneResult, Document } from 'mongodb';
import { Emoji, EmojiQuery, MongoEmoji } from './emojiTypes';

export class EmojiSerializer implements Serializer<EmojiQuery, Emoji, MongoEmoji> {
  serializeModel(arg: Emoji): Document{
    return removeUndefined({
      _id: makeObjectId(arg.id),
      shortname: arg.shortname,
      fileId: arg.fileId,
    });
  }

  serializeQuery(arg: EmojiQuery): Filter<Document>{
    if(!arg) return {};
    return this.serializeModel(arg);
  }

  deserializeModel(arg: MongoEmoji): Emoji | null {
    if(typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      shortname: arg.shortname,
      fileId: arg.fileId,
    }) as Emoji;
  }

  deserializeModelMany(arg: Array<MongoEmoji>): Array<Emoji>{
    return arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as Array<Emoji>;
  }


  deserializeInsertedId(arg: InsertOneResult<Document>): Id | null {
    if(typeof arg === 'object' && arg !== null && 'insertedId' in arg && arg.insertedId instanceof ObjectId) {
      return makeId(arg.insertedId);
    }else{
      return null;
    }
  }

  serializeId(arg: { id: Id }): MongoId {
    return { _id: makeObjectId(arg.id) };
  }
}


