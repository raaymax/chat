const multer = require('multer');
const express = require('express');
const config = require('../../../../../../chat.config');

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
    res.status(500).send(err);
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
    // eslint-disable-next-line no-console
    // console.error(err);
    res.status(err.code || 500).send(err);
  }
}

module.exports = router;
