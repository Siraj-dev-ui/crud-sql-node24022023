const express = require('express');
const routes = express.Router();
const controller = require('../controller/FileController');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    req.fileValidationError = `you are uploading  ( ${
      file.originalname.split(`.`)[1]
    } ) formate which isn't allowed. Only (png, jpeg, jpg & pdf) allowed to upload`;
    cb(null, false, req.fileValidationError);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

routes.post('/uploadFile', upload.single('file'), controller.uploadFile);

module.exports = routes;
