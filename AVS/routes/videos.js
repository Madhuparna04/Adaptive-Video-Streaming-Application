var express = require('express');
var router = express.Router();
var fs=require('fs');

// @route GET /videos
// @desc streams videos
router.get('/:filename',(req, res) => {
    console.log("reached 1");
  res.render('play_video', {file: req.params.filename, title: 'Watch Video'});
});

module.exports = router;