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



// @route GET /video/:filename
// @desc Display videos 
router.get('/:filename', (req, res) => {
    console.log("found file");
  gfs.files.findOne({filename: req.params.filename}, (err, file) => {
      // Check if files
      if(!file || file.length == 0){
          return res.status(404).json({
              err: 'No file exists'
          });
      }

      // Check if image
      if(file.contentType === 'video/mp4'){
          console.log('retreiving video from db');
          // Read output to browser
          const readstream = gfs.createReadStream(file.filename);
          readstream.pipe(res);
      }
      else{
          res.status(404).json({
              err: 'No file exists'
          });
      }
  });
});

// @route GET /videos
// @desc streams videos
router.get('/',(req, res) => {
    console.log('Reached videos');
  gfs.files.find().toArray((err, files) => {
    console.log('Reached gfs');
    console.log(files);
      // Check if files 
      if(!files || files.length == 0){
          res.render('play_video', {files: false, title: 'Watch Video'});
      } else {
          files.map(file => {
              console.log('reached map');
              if(file.contentType === 'video/mp4'){
                  file.isVideo = true;
              } else {
                  file.isVideo = false;
              }
          });
          res.render('play_video', {files: files, title: 'Watch Video'});
      }
  });
  //res.render('play_video', {files: false, title: 'Watch Video'});
});

module.exports = router;
