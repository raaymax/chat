import { Core } from "../../../../core/mod.ts";
import { Route } from '@codecat/planigale';

export default (core: Core) => new Route({
  method: "GET",
  url: "/:fileId",
  auth: true,
  schema: {
  },
  handler: async (req, res) => {
    res.send({ status: 'ok', fileId: req.state.file.fileId });
  }
});

/* 
const multer = require('multer');
const express = require('express');
const config = require('@quack/config');
const { initStorage } = require('@quack/storage');

const router = new express.Router();

const storage = initStorage(config);

const storageMulter = {
  _handleFile: (req, file, cb) => {
    storage.upload(file.stream, file).then((f) => {
      cb(null, f);
    }).catch((err) => {
      console.log(err);
      cb(err);
    });
  },

  _removeFile: (req, file, cb) => {
    storage.remove(file.fileId).then((f) => {
      cb(null, f);
    }).catch((err) => {
      console.log(err);
      cb(err);
    });
  },

  getFile: async (fileId) => storage.getFile(fileId),
};

const upload = multer({ storage: storageMulter });

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
const validateFileId = (fileId) => /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(fileId);

async function downloadFile(req, res) {
  try {
    const { fileId } = req.params;
    if (!validateFileId(fileId)) {
      return res.status(404).send({ errorCode: 'RESOURCE_NOT_FOUND', message: 'Invalid file id' });
    }
    const options = req.query.w || req.query.h ? {
      width: parseInt(req.query?.w, 10),
      height: parseInt(req.query?.h, 10),
    } : undefined;
    const file = await storage.get(fileId, options);
    res.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `inline; filename="${file.metadata.filename}"`,
    });
    file.getStream().pipe(res).on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      res.status(500).send({ errorCode: 'INTERNAL_SERVER_ERROR' });
    });
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
*/
