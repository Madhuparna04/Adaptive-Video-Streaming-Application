const express = require('express')
const app = express()
const port = 8000
const firebase = require("firebase/app");
const max_load_per_server = 10000;

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
var ref = firebase.database().ref("videoData/");


var local_servers =[];
var local_server = require('./classes/local_server.js');
let localServer = local_server.localServer;


ref.once('value', function(snapshot) {
	snapshot.forEach(function(childSnapshot) {
	var childKey = childSnapshot.val();
    });
    console.log("Connected to database ");
});


app.listen(port, () => {
	console.log(`Central server listening on port ${port}!`)
});


app.get('/', (req, res) => {
	var min = max_load_per_server;
	var server_index = -1;

	var i=0;
	for (i=0; i<local_servers.length; i++){
		if(min > local_servers[i].load){
			min = local_servers[i].load;
			server_index = i;
		}
	}

	console.log(local_servers[server_index]);
	res.redirect(local_servers[server_index].url);
});


app.post('/', (req, res) => {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	var initial_load = 0;
	var temp = new localServer(fullUrl, initial_load);
	local_servers.push(temp);
	
	res.send("Server noted successfully");

});

