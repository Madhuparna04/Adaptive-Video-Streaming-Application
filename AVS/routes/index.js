var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
	console.log("hello");
  res.render('index', { title: 'NITK Video Streaming App'} );
});

router.post('/search', function(req, res){
   res.redirect('/search/'+req.body.username);
});

router.post('/search/search_results', function(req, res){
   res.redirect('/search/search_results/'+req.body.Search);
});

module.exports = router;
