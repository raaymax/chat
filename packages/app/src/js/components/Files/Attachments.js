import { h } from 'preact';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { abort } from '../../services/file';
import { selectors } from '../../state';

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
      background-color: green;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 3px;
    }
  }
`;

export const Attachment = ({data: {fileName, contentType, progress}, ondelete}) => (
  <div class='attachment'>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
    <div class='remove' onclick={ondelete}><i class='fa-solid fa-xmark' /></div>
    <div class='progress' style={`width: ${progress}%;`} />
  </div>
);

export const Attachments = () => {
  const list = useSelector(selectors.getFiles);
  const dispatch = useDispatch();

  return (
    <Container>
      {list.map((file) => (
        <Attachment
          key={file.clientId}
          data={{...file}}
          ondelete={() => {
            dispatch(abort(file.clientId))
          }}
        />
      ))}
    </Container>
  );
}
