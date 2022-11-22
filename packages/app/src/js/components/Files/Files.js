import { h } from 'preact';
import { getUrl, getThumbnail } from '../../services/file';

const download = async (fileId) => {
  window.open(getUrl(fileId));
}

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const RAW_IMAGE_TYPES = ['image/gif', 'image/webp'];

export const File = ({data: {fileName, contentType, id}}) => (
  <div class='file' data-id={id} onclick={() => download(id)}>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
  </div>
)

export const Image = ({raw, data: {fileName, id}}) => (
  <div class='file image' data-id={id} onclick={() => download(id)}>
    {
      raw
        ? <img class='raw-image' src={getUrl(id)} alt={fileName} />
        : <img src={getThumbnail(id)} alt={fileName} />
    }
  </div>
)

export const Files = ({list}) => (
  <div>
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
  </div>
)
