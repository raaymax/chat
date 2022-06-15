import { client } from '../core';
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
  /*
  const ret = await client.req({
    type: 'initUpload',
    fileName: file.name,
    contentType: file.type,
  });
  */
  // update(local.clientId, { id: ret.data.fileId });
  try {
    const {status, fileId } = await uploadFile('POST', '/files', {
      file,
      clientId: local.clientId,
      progress: (progress) => {
        update(local.clientId, { progress });
      },
    });
    if (status === 'ok'){
      update(local.clientId, { id: fileId, progress: 100 });
    }else{
      update(local.clientId, {
        error: 'something went wrong',
        progress: 0,
      });
    }
    /*
    await client.req({
      type: 'finalizeUpload',
      fileId: ret.data.fileId,
      fileName: file.name,
      contentType: file.type,
    });
    */
  } catch (err) {
    update(local.clientId, {
      error: err.message,
      progress: 0,
    });
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

export const getUrl = async (id) => {
  const file = await client.req({
    type: 'initDownload',
    fileId: id,
  });
  return file.data.url;
};

function uploadFile(method, url, { file, progress, clientId }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      const data = JSON.parse(xhr.responseText);
      resolve(data);
    }, { once: true });
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        progress((e.loaded / e.total) * 100);
      }
    });
    xhr.addEventListener('error', (e) => reject(e), { once: true });
    xhr.open(method, url, true);

    var formData = new FormData();
    formData.append('file', file);
    update(clientId, { abort: () => xhr.abort() });
    xhr.send(formData);
  });
}
