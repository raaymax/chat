import { getUrl, getThumbnail } from '../../services/file';
import styled from 'styled-components';

const ImageContainer = styled.div`
  cursor: pointer;
  flex: 100%;
  width: 100%;
  height: 30px;
  padding: 0;
  margin: 3px 0px;
  display: flex;
  flex-direction: row;
  border: 1px solid var(--saf-0);
  height: auto;
  width: 100%;
  flex: 0;

  img.raw-image {
    max-width: 400px;
    max-height: 400px;
  }
  &:hover {
    background-color: var(--primary_active_mask);
  }
`;

const download = async (fileId: string) => {
  window.open(getUrl(fileId));
};

type ImageProps = {
  raw?: boolean;
  data: {
    id?: string;
    clientId?: string;
    fileName: string;
  };
};

export const Image = ({ raw, data: { fileName, id } }: ImageProps) => (
  <ImageContainer className='file image' data-id={id} onClick={() => id && download(id)}>
    {
      raw
        ? <img className='raw-image' src={getUrl(id)} alt={fileName} />
        : <img src={getThumbnail(id)} alt={fileName} />
    }
  </ImageContainer>
);

