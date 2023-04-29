import Repo from '../repo';
import { StreamIndex, StreamIndexQuery, MongoStreamIndex } from './streamIndexTypes';
import { StreamIndexSerializer } from './streamIndexSerializer';

export class StreamIndexRepo extends Repo<StreamIndexQuery, StreamIndex, MongoStreamIndex> {
  constructor() {
    super('stream_index', new StreamIndexSerializer());
  }
}
