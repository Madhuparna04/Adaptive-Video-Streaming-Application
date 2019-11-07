var express = require('express');
var router = express.Router();
var fs=require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
var multer = require('multer');


// Mongo URI
const mongoURI ='mongodb+srv://arpitha:arpi1998@cluster0-beacx.mongodb.net/test?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', () => {
    // Init stream
    console.log('Reached conn.once');
  gfs = Grid(conn.db, mongoose.mongo);
  console.log('db done');
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });

// @route GET /videos/:filename
// @desc streams videos
router.get('/:filename',(req, res) => {
    console.log('Reached videos');
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
    console.log('Reached gfs');
    console.log(file);
      // Check if files 
      if(!file){
          res.render('play_video', {file: false, title: 'Watch Video'});
      } else {
          res.render('play_video', {file: file, title: 'Watch Video'});
      }
  });
  //res.render('play_video', {files: false, title: 'Watch Video'});
});

module.exports = router;
