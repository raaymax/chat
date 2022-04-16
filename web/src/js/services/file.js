import client from '../client';
import { createCounter } from '../utils';
import { add, update } from '../store/file';

const tempId = createCounter(`file:${(Math.random() + 1).toString(36)}`);

export const upload = async (file) => {
  const local = {
    clientId: tempId(),
    fileName: file.name,
    contentType: file.type,
    progress: 0,
  };

  add(local);

  const ret = await client.req({
    op: {
      type: 'initUpload',
      fileName: file.name,
      contentType: file.type,
    },
  });

  update(local.clientId, {id: ret.resp.data.fileId});

  try{
    await uploadFile('PUT', ret.resp.data.url, {
      file, 
      clientId: local.clientId,
      progress: (progress) => {
        update(local.clientId, {progress});
      }
    });
  }catch(err) {
    update(local.clientId, {
      error: err.message,
      progress: 0,
    });
    console.error(err);
  }
  update(local.clientId, {progress: 100});
  console.log('upload Finished');

  await client.req({
    op: {
      type: 'finalizeUpload',
      fileId: ret.resp.data.fileId,
      fileName: file.name,
      contentType: file.type,
    },
  });
}

function uploadFile(method, url, {file, progress, clientId}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => resolve(), {once: true});
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        progress((e.loaded / e.total) * 100);
      }
    });
    xhr.addEventListener('error', (e) => reject(e), {once: true});
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    update(clientId, {abort: () => xhr.abort()});
    xhr.send(file);
  });
}
