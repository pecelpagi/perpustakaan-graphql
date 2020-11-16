const express = require('express');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime');

const createFilename = () => (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5));
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = `public/uploads`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, `${dir}/`);
  },
  filename: function(req, file, cb) {
    const fileExtension = mime.getExtension(file.mimetype);
    const filename = createFilename() + "." + fileExtension;
    
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

const uploadFile = (req, res) => {
    try {
        const newData = req.file;

        const api = {
            "status": true,
            "data": newData,
            "msg": 'success',
        }

        res.json(api);
    } catch (err) {
        console.log(err);
    }
}

const router = express.Router();
router.post('/', upload.single('photo'), uploadFile);

module.exports = router;