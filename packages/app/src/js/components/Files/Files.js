import {h} from 'preact';
import {useState, useEffect} from 'preact/hooks';
import client from '../../client';

const download = async (fileId) => {
  const file = await client.req({op: {type: 'initDownload', fileId}});
  window.open(file.resp.data.url);
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
    client.req({
      op: {
        type: 'initDownload',
        fileId: id,
      },
    }).then((file) => setUrl(file.resp.data.url));
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
