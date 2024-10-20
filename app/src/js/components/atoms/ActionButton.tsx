import { useCallback } from "react";
import { useMessageData } from "../contexts/useMessageData";
import { client } from "../../core";
import { useParams } from "react-router-dom";


export const ActionButton = ({children, action, style, payload}: any)=> {
  const {channelId, parentId} = useParams();
  const m = useMessageData();

  const onClick = useCallback(() => {
    client.api.postInteraction({
      channelId: channelId,
      parentId: parentId,
      clientId: m.clientId,
      appId: m.appId,
      action,
      payload
    })
  }, [action, payload, channelId, parentId, m]);
  return (
    <button onClick={onClick}>{children}</button>
  );
}
