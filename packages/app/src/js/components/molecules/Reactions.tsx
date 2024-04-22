import { useDispatch, useMethods } from '../../store';
import { useMessageData } from '../contexts/useMessageData';
import { Emoji } from './Emoji';
import { Tag } from '../atoms/Tag';

export const Reactions = () => {
  const { id, reactions = [] } = useMessageData();
  const dispatch = useDispatch();
  const methods = useMethods();

  const reactionMap = reactions
    .reduce<{[reaction: string]: number}>((acc, r) => ({ ...acc, [r.reaction]: (acc[r.reaction] || 0) + 1 }), {});
  return (
    <div>
      {Object.entries(reactionMap).map(([key, count]) => (
          <Tag key={key} onClick={() => dispatch(methods.messages.addReaction({id, text: key}))}> 
            {count > 1 ? `${count} ` : ''}
            <Emoji shortname={key} />
          </Tag>
      ))}
    </div>
  );
};
