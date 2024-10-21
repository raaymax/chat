import styled from 'styled-components';
import { getUrl, getThumbnail } from '../../services/file';
import { ClassNames, cn } from '../../utils';

const ImageContainer = styled.div`
  cursor: pointer;

  img {
    width: auto;
    height: 240px;
    min-width: 100px;
    max-width: 100%;
    object-fit: cover;
    margin: 0 auto;
    border-radius: 8px;
  }

  img.raw-image {
    max-width: 400px;
    max-height: 400px;
  }
  &:hover {
    img {
      transform: scale(1.1);
    }
    background-color: var(--primary_active_mask);
  }
`;

const download = async (fileId: string) => {
  window.open(getUrl(fileId));
};

type ImageProps = {
  raw?: boolean;
  className?: ClassNames
  data: {
    id?: string;
    clientId?: string;
    fileName: string;
  };
};

export const Image = ({ className, raw, data: { fileName, id } }: ImageProps) => (
  <ImageContainer className={cn('file', 'image', className)} data-id={id} onClick={() => id && download(id)}>
    {
      raw
        ? <img className='raw-image' src={getUrl(id ?? '')} alt={fileName} />
        : <img src={getThumbnail(id ?? '', {h: 240})} alt={fileName} />
    }
  </ImageContainer>
);
