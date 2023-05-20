import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { client } from '../core';

export const useLatestMessage = (stream) => {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!stream.channelId) return;
    client.req({
      ...stream,
      type: 'messages:load',
      limit: 1,
    })
      .catch((err) => console.log(err) || null)
      .then((ret) => setMsg(ret));
  }, [stream]);

  return msg;
};
