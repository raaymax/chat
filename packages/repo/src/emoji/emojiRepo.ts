import Repo from '../repo';
import { Emoji, EmojiQuery, MongoEmoji } from './emojiTypes';
import { EmojiSerializer } from './emojiSerializer';

export class EmojiRepo extends Repo<EmojiQuery, Emoji, MongoEmoji> {
  constructor() {
    super('emojis', new EmojiSerializer());
  }
}
