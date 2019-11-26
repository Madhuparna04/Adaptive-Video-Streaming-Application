var express = require('express');
var router = express.Router();
const axios = require('axios');
var fs=require('fs');
const NetworkSpeed = require('network-speed');
const testNetworkSpeed = new NetworkSpeed();

var speed = {};

 async function getNetworkDownloadSpeed(url) {
  const baseUrl = 'http://eu.httpbin.org/stream-bytes/50000000';
  const fileSize = 50000000;
  speed =  await testNetworkSpeed.checkDownloadSpeed(baseUrl, fileSize);
  console.log("Videos - Download speed : " + JSON.stringify(speed));
}

getNetworkDownloadSpeed();

// @route GET /videos
// @desc streams videos
router.get('/:filename',(req, res) => {
	// console.log("HEREEEEEE");
	var found = 0;
	console.log("Speed of Network in MBPS: " + speed.mbps);
	var sp = speed.mbps;
	var url=req.headers.referer
	// console.log(url);
	console.log(url.split("/")[2]);

	var path = './routes/videofiles-medium';
	var category = '2';

	if(sp < 300){
		path = './routes/videofiles-low';
		var category = '1';
	}

	else if(sp >= 300 && sp < 400){
		path = './routes/videofiles-medium';
		var category = '2';
	}

	else{
		path = './routes/videofiles-high';
		var category = '3';
	}

	console.log("Playing video from " + path);

	fs.readdirSync(path).forEach(file => {
		// console.log(file);
		if (file === req.params.filename+".mp4"){
			found = 1;
			res.render('play_video', {file: req.params.filename, title: 'Watch Video', cat: category});	
		}
	  });
  
	  if(found == 0){
		  
		  console.log('err: Video not found');
		  axios.post('http://localhost:8888/redirect/', {
			  file : req.params.filename,
			  url: 'http://localhost:3000'
		  }).then((response) => {
			console.log(response.data);
			res.redirect(response.data);
		  }, (error) => {
			console.log(error);
		  });
	  }
	// console.log("reached low");
	
  
});

module.exports = router;