import styled from 'styled-components';
import { getUrl, getThumbnail } from '../../services/file';
import PropTypes from 'prop-types';

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
  <div className='file' data-id={id} onClick={() => download(id)}>
    <div className='type'><i className='fa-solid fa-file' /></div>
    <div className='name'>{fileName} [{contentType}]</div>
  </div>
);

File.propTypes = {
  data: {
    fileName: PropTypes.string,
    contentType: PropTypes.string,
    id: PropTypes.string,
  },
};

export const Image = ({ raw, data: { fileName, id } }) => (
  <div className='file image' data-id={id} onClick={() => download(id)}>
    {
      raw
        ? <img className='raw-image' src={getUrl(id)} alt={fileName} />
        : <img src={getThumbnail(id)} alt={fileName} />
    }
  </div>
);

Image.propTypes = {
  raw: PropTypes.bool,
  data: PropTypes.shape({
    fileName: PropTypes.string,
    id: PropTypes.string,
  }),
};

export const Files = ({ list }) => (
  <Container>
    <div className='file-list'>
      {list
        .filter((file) => IMAGE_TYPES.includes(file.contentType))
        .map((file) => (
          <Image
            raw={RAW_IMAGE_TYPES.includes(file.contentType)}
            key={file.id || file.clientId}
            data={file} />
        ))}
    </div>
    <div className='file-list'>
      {list
        .filter((file) => !IMAGE_TYPES.includes(file.contentType))
        .map((file) => <File key={file.id || file.clientId} data={file} />)}
    </div>
  </Container>
);

Files.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    fileName: PropTypes.string,
    contentType: PropTypes.string,
    id: PropTypes.string,
  })),
};
