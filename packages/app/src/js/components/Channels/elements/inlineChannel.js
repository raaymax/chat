import { h } from 'preact';
import {Badge} from './badge';

export const InlineChannel = ({
  id, children, badge, className, onClick, icon = 'fa-solid fa-hashtag',
}) => (
  <div className={`channel ${className || ''}`} data-id={id} onClick={onClick}>
    <i class={icon} />
    <span class='name'>{children}</span>
    {badge > 0 && <Badge>{badge}</Badge>}
  </div>
)
