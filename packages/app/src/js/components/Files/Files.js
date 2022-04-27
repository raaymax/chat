import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { getUrl } from '../../services/file';

const download = async (fileId) => {
  window.open(await getUrl(fileId));
}

export const File = ({data: {fileName, contentType, id}}) => (
  <div class='file' data-id={id} onclick={() => download(id)}>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
  </div>
)

export const Image = ({data: {fileName, id}}) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    getUrl(id).then((ret) => setUrl(ret));
  });
  return (
    <div class='file image' data-id={id} onclick={() => download(id)}>
      {url
        ? <img src={url} alt={fileName} />
        : <div>Loaging image</div>
      }
    </div>
  );
}

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
