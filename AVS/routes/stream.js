var express = require('express');
var router = express.Router();
var fs=require('fs');

// @route GET /stream/:filename
// @desc Display videos 
router.get('/:filename', (req, res) => {
    console.log("reached 2");
    const path = __dirname + '/videofiles/' + req.params.filename;
    const stat = fs.statSync(path);
    const fileSize = stat.size
    const range = req.headers.range
    

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        console.log(parts);
        const start = parseInt(parts[0], 10)
        const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1

        const chunksize = (end-start)+1
        const file = fs.createReadStream(path, {start, end})
        const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
        }

        console.log(head);

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
});

module.exports = router;