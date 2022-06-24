import { h } from 'preact';
import {getUrl} from '../../services/file';

const download = async (fileId) => {
  window.open(getUrl(fileId));
}

export const File = ({data: {fileName, contentType, id}}) => (
  <div class='file' data-id={id} onclick={() => download(id)}>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
  </div>
)

export const Image = ({data: {fileName, id}}) => (
  <div class='file image' data-id={id} onclick={() => download(id)}>
    <img src={getUrl(id)} alt={fileName} />
  </div>
)

export const Files = ({list}) => (
  <div>
    {list.map((file) => {
      if ([
        'image/png',
        'image/jpg',
        'image/jpeg',
      ].includes(file.contentType)) {
        return <Image key={file.clientId} data={file} />;
      }
      return <File key={file.clientId} data={file} />;
    })}
  </div>
)
