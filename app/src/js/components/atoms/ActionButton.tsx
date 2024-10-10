import { useCallback } from "react";
import { useStream } from "../contexts/useStream";
import { useMessageData } from "../contexts/useMessageData";
import { client } from "../../core";


export const ActionButton = ({children, action, style, payload}: any)=> {
  const [stream] = useStream();
  const m = useMessageData();

  const onClick = useCallback(() => {
    client.api.postInteraction({
      channelId: stream.channelId,
      parentId: stream.parentId,
      clientId: m.clientId,
      appId: m.appId,
      action,
      payload
    })
  }, [action, payload, stream, m]);
  return (
    <button onClick={onClick}>{children}</button>
  );
}
