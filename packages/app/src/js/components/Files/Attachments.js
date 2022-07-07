import {h} from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import {abort} from '../../services/file';

export const Attachment = ({data: {fileName, contentType, progress}, ondelete}) => (
  <div class='attachment'>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
    <div class='remove' onclick={ondelete}><i class='fa-solid fa-xmark' /></div>
    <div class='progress' style={`width: ${progress}%;`} />
  </div>
);

export const Attachments = () => {
  const list = useSelector((state) => state.files.list);
  const dispatch = useDispatch();

  return (
    <div>
      {list.map((file) => (
        <Attachment
          key={file.clientId}
          data={{...file}}
          ondelete={() => {
            dispatch(abort(file.clientId))
          }}
        />
      ))}
    </div>
  );
}
