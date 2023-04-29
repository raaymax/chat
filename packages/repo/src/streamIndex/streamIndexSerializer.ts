import { Serializer, MongoId, Id} from '../types';
import { removeUndefined, makeObjectId, makeId } from '../util';
import { ObjectId, Filter, InsertOneResult, Document } from 'mongodb';
import { StreamIndex, StreamIndexQuery, MongoStreamIndex } from './streamIndexTypes';

export class StreamIndexSerializer implements Serializer<StreamIndexQuery, StreamIndex, MongoStreamIndex> {
  serializeModel(arg: StreamIndex): Document{
    return removeUndefined({
      _id: makeObjectId(arg.id),
      key: arg.key,
      idx: arg.idx,
    });
  }

  serializeQuery(arg: StreamIndexQuery): Filter<Document>{
    return this.serializeModel(arg);
  }

  deserializeModel(arg: MongoStreamIndex): StreamIndex | null {
    if(typeof arg !== 'object' || arg === null) {
      return null;
    }
    return removeUndefined({
      id: makeId(arg._id),
      key: arg.key,
      idx: arg.idx,
    }) as StreamIndex;
  }

  deserializeModelMany(arg: Array<MongoStreamIndex>): Array<StreamIndex>{
    return arg.map((c) => this.deserializeModel(c)).filter((c) => c !== null) as Array<StreamIndex>;
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


