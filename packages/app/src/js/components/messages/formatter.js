import { h } from 'preact';
import { Message } from './message';
import { Notification } from './notification';
import { DateSeparator} from './dateSeparator';
import { formatTime, formatDate } from '../../utils';

export const messageFormatter = (messages) => {
  let prev;
  return [...messages].reverse().map((msg) => {
    let sameUser = false;
    let sameDate = false;
    if (!msg.priv) {
      sameUser = prev
              && prev?.userId === msg?.userId
              && (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
    }
    sameDate = prev
            && formatDate(prev?.createdAt) === formatDate(msg?.createdAt)
    prev = msg;
    return [
      !sameDate ? <DateSeparator key={`dateChange:${formatDate(msg.createdAt)}`}>
        {formatDate(msg.createdAt)}
      </DateSeparator> : null,
      msg.notif
        ? <Notification
          key={msg.id || msg.clientId}
          className={[msg.notifType]}>
          {msg.notif}
        </Notification>
        : <Message
          class={msg.priv ? ['private'] : []}
          data-id={msg.id}
          client-id={msg.clientId}
          key={`${msg.id}-${msg.clientId}`}
          sameUser={sameUser}
          data={msg}
        />,
    ];
  }).flat().filter((e) => e !== null);
}
