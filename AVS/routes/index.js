var express = require('express');
var request=require('request');
var router = express.Router();

/* GET home page. */

function server_init() {
	request.get('http://localhost:8888',{ json: true },function(err,res,body){
  	if(err){
  		console.log("server not noted");
  	}

    if(res.statusCode === 200 ) {
    	console.log("local noted");
    }
});
}

server_init();

router.get('/', function(req, res, next) {
	console.log("Video Streaming App Started");
  res.render('index', { title: 'NITK Video Streaming App'} );
});

router.post('/search', function(req, res){
   res.redirect('/search/'+req.body.username);
});

router.post('/search/search_results', function(req, res){
   res.redirect('/search/search_results/'+req.body.Search);
});

module.exports = router;
