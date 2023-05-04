const multer = require('multer');
const express = require('express');
const config = require('../../../../../../config');

const router = new express.Router();

const storage = config.fileStorage === 'memory'
  ? require('./MemoryStorage')
  : require('./GcsStorage');

const upload = multer({ storage });

router.post('/', upload.single('file'), uploadFile);
router.get('/:fileId', downloadFile);

async function uploadFile(req, res) {
  try {
    res.status(200).send({ status: 'ok', fileId: req.file.fileId });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send({ errorCode: 'INTERNAL_SERVER_ERROR' });
  }
}

async function downloadFile(req, res) {
  try {
    const { fileId } = req.params;
    const file = await storage.getFile(fileId);
    res.set({
      'Content-Type': file.contentType,
      'Content-disposition': file.contentDisposition,
    });
    file.stream.pipe(res);
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return res.status(404).send({ errorCode: 'RESOURCE_NOT_FOUND' });
    }
    if (typeof err.code === 'number') {
      return res.status(err.code).send({ errorCode: 'CLIENT_ERROR', message: err.message });
    }
    // eslint-disable-next-line no-console
    // console.error(err);
    res.status(500).send({ errorCode: 'INTERNAL_SERVER_ERROR' });
  }
}

module.exports = router;
