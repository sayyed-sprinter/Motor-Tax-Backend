const path = require('path');
const multer = require('multer');
const express = require('express');
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

router.post('/document', upload.single('documents'), (req, res) => {
  try {
    res.json({
      success: true,
      file: { name: req.file.filename, path: req.file.path },
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
