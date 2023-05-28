import { h } from 'preact';
import styled from 'styled-components';
import { getUrl, getThumbnail } from '../../services/file';

const download = async (fileId) => {
  window.open(getUrl(fileId));
};

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const RAW_IMAGE_TYPES = ['image/gif', 'image/webp'];

const Container = styled.div`
  max-width: calc(100%)
  .file-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .file {
    cursor: pointer;
    flex: 100%;
    width: 100%;
    height: 30px;
    padding: 0;
    margin: 3px 0px;
    display: flex;
    flex-direction: row;
    border: 1px solid var(--saf-0);
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
    &:hover {
      background-color: var(--primary_active_mask);
    }
    &.image {
      height: auto;
      width: 100%;
      flex: 0;

      img.raw-image {
        max-width: 400px;
        max-height: 400px;
      }
    }
  }
`;

export const File = ({ data: { fileName, contentType, id } }) => (
  <div class='file' data-id={id} onclick={() => download(id)}>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
  </div>
);

export const Image = ({ raw, data: { fileName, id } }) => (
  <div class='file image' data-id={id} onclick={() => download(id)}>
    {
      raw
        ? <img class='raw-image' src={getUrl(id)} alt={fileName} />
        : <img src={getThumbnail(id)} alt={fileName} />
    }
  </div>
);

export const Files = ({ list }) => (
  <Container>
    <div class='file-list'>
      {list
        .filter((file) => IMAGE_TYPES.includes(file.contentType))
        .map((file) => (
          <Image
            raw={RAW_IMAGE_TYPES.includes(file.contentType)}
            key={file.clientId}
            data={file} />
        ))}
    </div>
    <div class='file-list'>
      {list
        .filter((file) => !IMAGE_TYPES.includes(file.contentType))
        .map((file) => <File key={file.clientId} data={file} />)}
    </div>
  </Container>
);
