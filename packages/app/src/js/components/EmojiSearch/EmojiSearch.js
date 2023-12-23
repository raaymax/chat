import { h } from 'preact';
import { useState, useEffect} from 'preact/hooks';
import { useSelector } from 'react-redux';
import { Emoji } from './elements/emoji';
import { EmojiBlock } from './elements/emojiBlock';
import { Tooltip } from '../../elements/tooltip';
import { Label } from './elements/label';
import { SearchBox } from './elements/searchBox';
import { EmojiScroll } from './elements/emojiScroll';
import { EmojiCategory } from './elements/emojiCategory';
import { EmojiSearchContainer } from './elements/emojiSearchContainer';
import { useEmojiFuse } from '../../hooks';

const CATEGORIES = {
  p: 'Smileys & Emotion',
  c: 'Custom',
  e: 'Components',
  b: 'People & Body',
  n: 'Animals & Nature',
  d: 'Food & Drink',
  a: 'Activities',
  t: 'Travel & Places',
  o: 'Objects',
  s: 'Symbols',
  k: 'Flags',
  f: 'Font',
};

export const EmojiSearch = ({ onSelect }) => {
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const emojis = useSelector((state) => state.emojis.data);
  const fuse = useEmojiFuse();

  useEffect(() => {
    let all = emojis || [];
    if (name && fuse) {
      const ret = fuse.search(name, { limit: 100 });
      all = ret.map((r) => r.item);
    }

    setResults(
      (all || [])
        .reduce((acc, emoji) => {
          acc[emoji.category] = acc[emoji.category] || [];
          acc[emoji.category].push(emoji);
          return acc;
        }, {}),
    );
  }, [name, fuse, emojis]);

  return (
    <EmojiSearchContainer>
      <SearchBox onChange={(e) => setName(e.target.value)} value={name} />
      <EmojiScroll>
        {Object.keys(CATEGORIES).filter((c) => results[c]).map((category, idx) => (
          <EmojiCategory key={idx}>
            <Label>{CATEGORIES[category]}</Label>
            <EmojiBlock>
              {(results[category] || []).map((result, idx) => (
                <Tooltip text={result.shortname} key={idx}>
                  <Emoji
                    fileId={result.fileId}
                    unicode={result.unicode}
                    shortname={result.shortname}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelect(result);
                    }}
                  />
                </Tooltip>
              ))}
            </EmojiBlock>
          </EmojiCategory>
        ))}
      </EmojiScroll>
    </EmojiSearchContainer>
  );
};
