import { useMemo } from 'react';
import { useDispatch, useSelector } from '../../store';
import styled from 'styled-components';
import { abort } from '../../services/file';
import { useStream } from '../contexts/useStream';

const Container = styled.div`
  .attachment {
    position: relative;
    height: 30px;
    padding: 0;
    margin: 3px 15px;
    display: flex;
    flex-direction: row;
    border: 1px solid var(--saf-0);
    max-width: calc(100vw - 30px);

    .type {
      line-height: 30px;
      width: 30px;
      text-align: center;
      vertical-align: middle;
    }

    .name {
      padding: 0 10px;
      line-height: 30px;
      vertical-align: middle;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .remove {
      color: #852007;
      cursor: pointer;
      line-height: 30px;
      width: 30px;
      text-align: center;
      vertical-align: middle;
      &:hover {
        background-color: var(--primary_active_mask);
      }
    }

    .progress {
      background-color: #216dad;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 3px;
    }

    .progress.done {
      background-color: green;
    }
  }
`;

type AttachmentProps = {
  data: {
    fileName: string;
    contentType: string;
    progress: number;
    status: string;
  };
  onDelete: () => void;
};

export const Attachment = ({
  data: { fileName, contentType, progress, status },
  onDelete,
}: AttachmentProps) => (
  <div className='attachment'>
    <div className='type'><i className='fa-solid fa-file' /></div>
    <div className='name'>{fileName} [{contentType}]</div>
    <div className='remove' onClick={onDelete}><i className='fa-solid fa-xmark' /></div>
    <div className={status === 'ok' ? 'progress done' : 'progress'} style={{width: `${progress}%`}} />
  </div>
);

export const Attachments = () => {
  const [stream] = useStream();
  // FIXME: files as any
  const files: any = useSelector((state: any) => state.files);
  const list = useMemo(() => files.filter((file: any) => file.streamId === stream.id), [files, stream.id]);
  const dispatch: any = useDispatch();

  return (
    <Container>
      {(list || []).map((file: any) => (
        <Attachment
          key={file.clientId}
          data={{ ...file }}
          onDelete={() => {
            dispatch(abort(file.clientId));
          }}
        />
      ))}
    </Container>
  );
};
