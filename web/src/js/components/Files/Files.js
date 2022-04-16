import {h} from 'preact';
import client from '../../client';

const download = async (fileId) => {
  const file = await client.req({op: {type: 'initDownload', fileId}});
  window.open(file.resp.data.url);
}

export const File = ({data: {fileName, contentType, id}}) => (
  <div class='file' onclick={() => download(id)}>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName}</div>
    <div class='type-text'>{contentType}</div>
  </div>
)

export const Files = ({list}) => (
  <div>
    {list.map((file) => (
      <File
        key={file.clientId}
        data={file}
      />
    ))}
  </div>
)
