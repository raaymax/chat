import { Emoji } from '../../types.ts';
import { Repo } from './repo.ts';

type EmojiQuery = Partial<Emoji>;
class EmojiRepo extends Repo<EmojiQuery, Emoji>{
  COLLECTION = 'emojis';
}

export const emoji = new EmojiRepo();
