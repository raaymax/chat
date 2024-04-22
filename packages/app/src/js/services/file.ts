import { createCounter } from '../utils';
import { createMethod } from '../store';

const tempId = createCounter(`file:${(Math.random() + 1).toString(36)}`);

const FILES_URL = `${API_URL}/files`;

type FilesUpload = {
  streamId: string;
  files: FileList;
};

type FileUpload = {
  streamId: string;
  file: File;
};

export const uploadMany = createMethod('files/uploadMany', async ({streamId, files}: FilesUpload, {dispatch}) => {
  for (let i = 0, file; i < files.length; i++) {
    file = files.item(i);
    if (!file) continue;
    dispatch(upload({streamId, file}));
  }
});

const isError = (err: unknown): err is Error => err instanceof Error;

export const upload = createMethod('files/upload', async ({streamId, file}: FileUpload, {dispatch, actions}) => {
  const local = {
    streamId,
    clientId: tempId(),
    fileName: file.name,
    contentType: file.type,
    progress: 0,
    status: 'uploading',
  };

  dispatch(actions.files.add(local));

  try {
    const { status, fileId } = await uploadFile(FILES_URL, {
      file,
      clientId: local.clientId,
      progress: (progress) => {
        dispatch(actions.files.update({ id: local.clientId, file: { progress } }));
      },
    });
    if (status === 'ok') {
      dispatch(actions.files.update({ id: local.clientId, file: { id: fileId, progress: 100, status: 'ok' } }));
    } else {
      dispatch(actions.files.update({
        id: local.clientId,
        file: {
          error: 'something went wrong',
          progress: 0,
        },
      }));
    }
  } catch (err) {
    if (isError(err)){
      dispatch(actions.files.update({
        id: local.clientId,
        file: {
          error: err.message,
          progress: 0,
        },
      }));
    }
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

export const getUrl = (id: string) => `${FILES_URL}/${id}`;
export const getThumbnail = (id: string) => `${getUrl(id)}?h=256&w=256`;
const aborts: Record<string, (() => void)> = {};

export const abort = createMethod('files/abort', async (clientId: string, {dispatch, actions}) => {
  try {
    aborts[clientId] && aborts[clientId]();
    dispatch(actions.files.remove(clientId));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
});

type UploadArgs = {
  file: File;
  clientId: string;
  progress: (progress: number) => void;
};

function uploadFile(url: string, { file, progress, clientId }: UploadArgs): Promise<{ status: string, fileId: string }>{
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
    xhr.open('POST', url, true);

    const formData = new FormData();
    formData.append('file', file);
    aborts[clientId] = () => xhr.abort();
    xhr.send(formData);
  });
}
