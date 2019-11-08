var express = require('express');
var router = express.Router();
const axios = require('axios');
var fs=require('fs');

// @route GET /videos
// @desc streams videos
router.get('/:filename',(req, res) => {
	console.log("HEREEEEEE");
	var found = 0;
	fs.readdirSync('./routes/videofiles').forEach(file => {
	  console.log(file);
	  if (file === req.params.filename+".mp4"){
	  	found = 1;
	  	res.render('play_video', {file: req.params.filename, title: 'Watch Video'});	
	  }
	});

	if(found == 0){
		console.log('Video not found');
		axios.post('http://localhost:8888/redirect/', {
			file : req.params.filename,
			url: 'http://localhost:3002'
		}).then((response) => {
		  console.log(response.data);
		  res.redirect(response.data);
		}, (error) => {
		  console.log(error);
		});
	}
    console.log("reached 1");
  
});

module.exports = router;
