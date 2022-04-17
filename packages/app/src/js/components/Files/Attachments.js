import {h} from 'preact';
import { useState } from '../../utils.js';
import * as files from '../../store/file';

export const Attachment = ({data: {fileName, contentType, progress}, ondelete}) => (
  <div class='attachment'>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
    <div class='remove' onclick={ondelete}><i class='fa-solid fa-xmark' /></div>
    <div class='progress' style={`width: ${progress}%;`} />
  </div>
);

export const Attachments = () => {
  const [list, setList] = useState([]);
  files.watchFiles((l) => setList([...l]));

  return (
    <div>
      {list.map((file) => (
        <Attachment
          key={file.clientId}
          data={{...file}}
          ondelete={() => {
            file.abort();
            files.remove(file.clientId);
          }}
        />
      ))}
    </div>
  );
}
