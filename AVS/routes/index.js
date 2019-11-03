var express = require('express');
var router = express.Router();
var fs=require('fs');
/* GET home page. */

router.get('/', function(req, res, next) {
	console.log("hello");
  res.render('index', { title: 'NITK Video Streaming App'} );
});

router.get('/stuff.mp4',function(req,res)
{
   console.log("video requested");
   dir_name=__dirname;
   const path = dir_name+'/stuff.mp4';
   const stat = fs.statSync(path);
   const fileSize = stat.size;
   const range = req.headers.range;
   //console.log("headers are:-");
   //console.log(req.headers);
   console.log("range is "+range);
   if(range)
   {
     const parts = range.replace(/bytes=/, "").split("-");
     const start = parseInt(parts[0], 10);
     const end = parts[1]? parseInt(parts[1], 10): fileSize-1;
     console.log("filesize = "+fileSize);
     console.log("start = "+start);
     console.log("end = "+end);
     const chunksize = (end-start)+1;
     console.log("chunksize = "+chunksize);
     const file = fs.createReadStream(path, {start, end});
     const head = {
       'Content-Range': `bytes ${start}-${end}/${fileSize}`,
       'Accept-Ranges': 'bytes',
       'Content-Length': chunksize,
       'Content-Type': 'video/mp4',
     }
     res.writeHead(206, head);
     file.pipe(res);
   }
   else
   {
      console.log("in false");
      const head = {
       'Content-Length': fileSize,
       'Content-Type': 'video/mp4',
     }
     res.writeHead(200, head);
     fs.createReadStream(path).pipe(res);
   }
});

router.get('/pictures/pic.png',function(req,res)
{
   console.log('picture requested');
});

router.post('/search', function(req, res){
   res.redirect('/search/'+req.body.username);
});

router.post('/search/search_results', function(req, res){
   res.redirect('/search/search_results/'+req.body.Search);
});

module.exports = router;
