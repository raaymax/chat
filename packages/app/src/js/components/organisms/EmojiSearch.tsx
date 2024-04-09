import { useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from '../atoms/Tooltip';
import { SearchBox } from '../atoms/SearchBox';
import { useEmojiFuse } from '../../hooks';
import styled from 'styled-components';
import { getUrl } from '../../services/file';

export const Label = styled.div`
  width: 100%;
  color: gray;
  font-size: 12px;
  padding: 10px;

  color: ${(props) => props.theme.labelColor};
`;

export const EmojiSearchContainer = styled.div`
  position: absolute;
  user-select: none;
  display: flex;
  flex-direction: column;
  bottom: 100px;
  right: 30px;
  width: 400px;
  height: 500px;
  z-index: 100;
  border-radius: 10px;
  padding-bottom: 10px;
  background-color: ${(props) => props.theme.backgroundColor};
  border: 1px solid ${(props) => props.theme.borderColor};
  
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  * {
    user-select: none;
  }
`;

const Scroll = styled.div`
  flex: 1 1 auto;
  overflow-y: scroll;
  scrollbar-width: none;
  overflow-x: hidden;
  padding: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const EmojiScroll = ({ children }: {children: React.ReactNode}) => (
  <Scroll>
    <div>
      {children}
    </div>
  </Scroll>
);


const EmojiCategory = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const EmojiBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

const EmojiContainer = styled.div`
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  font-size: 20px;
  align-content: center;
  vertical-align: middle;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  user-select: none;
  img {
    width: 28px;
    height: 28px;
  }
  body.mobile & {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    font-size: 30px;
    img {
      width: 38px;
      height: 38px;
    }
  }
  &:hover {
    border-radius: 5px;
    background-color: rgba(249,249,249,0.05);
  }
`;

type Emoji = {
  unicode: string;
  fileId: string;
  shortname: string;
  category: string;
}

type EmojiProps = {
  unicode: string;
  fileId: string;
  shortname: string;
  onClick: (e: React.MouseEvent) => void;
};

export const Emoji = ({
  unicode, fileId, shortname, onClick,
}: EmojiProps) => (
  <EmojiContainer onClick={onClick}>
    {fileId
      ? <img src={getUrl(fileId)} alt={shortname} />
      : <span>{String.fromCodePoint(parseInt(unicode, 16))}</span>}
  </EmojiContainer>
);


const CATEGORIES: Record<string, string> = {
  p: 'People',
  c: 'Custom',
  n: 'Nature',
  d: 'Food',
  a: 'Activity',
  t: 'Travel',
  o: 'Objects',
  s: 'Symbols',
  k: 'Flags',
  f: 'Font',
};

type EmojiSearchProps = {
  onSelect: (e: Emoji) => void;
}

export const EmojiSearch = ({ onSelect }: EmojiSearchProps) => {
  const [name, setName] = useState('');
  const [results, setResults] = useState<Record<string, Emoji[]>>({});
  const emojis = useSelector((state) => (state as any).emojis.data);
  const fuse = useEmojiFuse();

  useEffect(() => {
    let all: Emoji[] = emojis || [];
    if (name && fuse) {
      const ret = fuse.search(name, { limit: 100 });
      all = ret.map((r) => r.item);
    }

    setResults(
      (all || [])
        .reduce((acc: Record<string, Emoji[]>, emoji) => {
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
        {Object.keys(CATEGORIES).filter((c: string) => results[c]).map((category: string, idx: number) => (
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

