var express = require('express');
var router = express.Router();
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyA0MOUn5aSYnMy3cm-QAlB13fVykNSjxFk",
  authDomain: "avs-it.firebaseapp.com",
  databaseURL: "https://avs-it.firebaseio.com",
  projectId: "avs-it",
  storageBucket: "avs-it.appspot.com",
  messagingSenderId: "5967336401",
  appId: "1:5967336401:web:396179e2720df9d04f86f0",
  measurementId: "G-7RQ0T2D8JF"
};

firebase.initializeApp(firebaseConfig);

router.get('/:uname', function(req, res, next) {
    res.render('search',{uname: req.params.uname,title: 'Search'});
});

var list_names=[]
var list_tags=[]
var ref = firebase.database().ref("videos/");
ref.once('value', function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
	var childKey = childSnapshot.val();
	list_names.push(childKey.Vname);
	list_tags.push(childKey.tags);

    });
    console.log("Done!");
});


router.get('/search_results/:query', function(req, res, next) {

	var results=[]
	var qr = req.params.query;
	for(var i=0;i<list_names.length;++i)
	{
		if(list_names[i].includes(qr))
			{
				results.push({
					    name:   list_names[i],
					    tags:   list_tags[i]
						});
			}
	}
	for(var j=results.length;j<5;++j){
		results.push({
					    name:   "",
					    tags:  ""
						});
		
	}
console.log(qr);
console.log(results);
res.render('search_results', { query: qr, result: results,title: 'Search Query' });
    });

module.exports = router;




/*
	var ID = req.params.id;
	var ref = firebase.database().ref("videos/"+ID);
	result=0;
	tg=[];
	ref.on("value", function(snapshot) {
		result = snapshot.val().Vname;
		tg = snapshot.val().tags;
		res.render('search_results', { output: ID, searched: result,tags: tg });

	}, function (error) {
	   console.log("Error: " + error.code);
	});
*/
