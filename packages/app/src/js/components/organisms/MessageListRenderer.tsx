import React from 'react';
import { Message } from './Message';
import { Notification } from '../atoms/Notification';
import { DateSeparator } from '../atoms/DateSeparator';
import { formatDate } from '../../utils';
import * as types from '../../types';

export type MessageListRendererProps = {
  list: (types.Message| types.Notif)[];
  stream?: any;
  context?: any;
  onMessageClicked?: any;
};

function isNotif(data: types.Message | types.Notif): data is types.Notif {
  return (data as types.Notif).notif !== undefined;
}

export const MessageListRenderer = ({
  list: messages, stream, context, onMessageClicked = () => {},
}: MessageListRendererProps) => {
  let prev: types.Message | types.Notif;
  return (<>
    {[...messages].reverse().map((msg) => {
      let sameUser = false;
      let sameDate = false;
      if (!msg.priv) {
        sameUser = prev
          && prev?.userId === msg?.userId
          && (new Date(msg.createdAt) - new Date(prev.createdAt)) < 60000;
      }
      sameDate = prev
        && formatDate(prev?.createdAt) === formatDate(msg?.createdAt);
      prev = msg;
      return <React.Fragment key={msg.id +'-'+ msg.clientId}>
        {isNotif(msg)
          ? <Notification
            className={[msg.notifType]}>
            {msg.notif}
          </Notification>
          : <Message
            stream={stream}
            context={context}
            onClick={() => onMessageClicked(msg)}
            className={msg.priv ? ['private'] : []}
            data-id={msg.id}
            data-date={msg.createdAt}
            client-id={msg.clientId}
            sameUser={sameUser}
            data={msg}
          />}
        {!sameDate ? <DateSeparator key={`date:${msg.createdAt}`} date={msg.createdAt} /> : null}
      </React.Fragment>
    }).reverse()}
  </>);
};
