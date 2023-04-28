import Repo from '../repo';
import { Channel, ChannelQuery, MongoChannel } from './channelTypes';
import { ChannelSerializer } from './channelSerializer';

export class ChannelRepo extends Repo<ChannelQuery, Channel, MongoChannel> {
  constructor() {
    super('channels', new ChannelSerializer());
  }
}
