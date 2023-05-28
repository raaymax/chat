/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createCounter } from '../utils';
import { actions } from '../state';

const tempId = createCounter(`file:${(Math.random() + 1).toString(36)}`);

const FILES_URL = `${document.location.protocol}//${document.location.host}/files`;

export const uploadMany = createAsyncThunk('files/upload/many', async (files, { dispatch }) => {
  for (let i = 0, file; i < files.length; i++) {
    file = files.item(i);
    dispatch(upload(file));
  }
});

export const upload = createAsyncThunk('files/upload', async (file, { dispatch }) => {
  const local = {
    clientId: tempId(),
    fileName: file.name,
    contentType: file.type,
    progress: 0,
  };

  dispatch(actions.addFile(local));

  try {
    const { status, fileId } = await uploadFile('POST', FILES_URL, {
      file,
      clientId: local.clientId,
      dispatch,
      progress: (progress) => {
        dispatch(actions.updateFile({ id: local.clientId, file: { progress } }));
      },
    });
    if (status === 'ok') {
      dispatch(actions.updateFile({ id: local.clientId, file: { id: fileId, progress: 100 } }));
    } else {
      dispatch(actions.updateFile({
        id: local.clientId,
        file: {
          error: 'something went wrong',
          progress: 0,
        },
      }));
    }
  } catch (err) {
    dispatch(actions.updateFile({
      id: local.clientId,
      file: {
        error: err.message,
        progress: 0,
      },
    }));
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

export const getUrl = (id) => `${FILES_URL}/${id}`;
export const getThumbnail = (id) => `${IMAGES_URL}/${id}?h=256&w=256&fit=clip`;
const aborts = {};

export const abort = createAsyncThunk('files/abort', async (clientId, { dispatch }) => {
  try {
    aborts[clientId] && aborts[clientId]();
    dispatch(actions.removeFile(clientId));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

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

    const formData = new FormData();
    formData.append('file', file);
    aborts[clientId] = () => xhr.abort();
    xhr.send(formData);
  });
}
