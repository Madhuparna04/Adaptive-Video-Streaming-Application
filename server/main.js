const express = require('express')
const app = express()
const router = express.Router();
const port = 8888
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


var local_servers_map = {};
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
	var server_url = "";

	var temp2 = new localServer("http://127.0.0.1:3000",0);
	local_servers_map[temp2.url] = temp2;

	var temp1 = new localServer("http://127.0.0.1:3001",0);
	local_servers_map[temp1.url] = temp1;

	for (server in local_servers_map){
		if(min > local_servers_map[server].load){
			min = local_servers_map[server].load;
			server_url = local_servers_map[server].url;
		}
	}

	local_servers_map[server_url].load++;
	res.redirect(server_url);
});


app.post('/', (req, res) => {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	var initial_load = 0;
	var temp = new localServer(fullUrl, initial_load);
	local_servers_map[fullUrl] = temp;
	
	res.send("Server recorded successfully");

});

app.get('/videos/:videoId', (req, res) => {

	var prevUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log("here");
	console.log(req.params.videoId);
	var v_ref = firebase.database().ref("videoData/"+req.params.videoId);
	required_servers= [];

	console.log(v_ref);
	v_ref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var childKey = childSnapshot.val();
			required_servers.push(childKey);
    	});

	});

	var min = max_load_per_server;
	var newUrl = "";
	for (server in required_servers){
		if(min > local_servers_map[server].load){
			min = local_servers_map[server].load;
			newUrl = local_servers_map[server].url;
		}
	}

	local_servers_map[newUrl].load++;
	local_servers_map[prevUrl].load--;
	res.redirect(newUrl);
});

