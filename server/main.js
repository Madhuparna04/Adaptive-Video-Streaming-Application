const express = require('express')
const app = express()
const router = express.Router();
const port = 8888
const firebase = require("firebase/app");
const max_load_per_server = 10000;
const bodyParser = require('body-parser')


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

app.use(
  bodyParser.urlencoded({
    extended: true
  })
)

app.use(bodyParser.json())


app.listen(port, () => {
	console.log(`Central server listening on port ${port}!`)
});


app.get('/', (req, res) => {
	var min = max_load_per_server;
	var server_url = "";
	
	for (server in local_servers_map){
		if(min > local_servers_map[server].load){
			min = local_servers_map[server].load;
			server_url = local_servers_map[server].url;
		}
	}

	console.log(server_url);
	local_servers_map[server_url].load++;
	res.redirect(server_url);
});


app.post('/', (req, res) => {
	console.log("noting server");
	var fullUrl = req.body.url;
	console.log(fullUrl);

	var initial_load = 0;
	var temp = new localServer(fullUrl, initial_load);
	local_servers_map[fullUrl] = temp;
	console.log(local_servers_map);
	res.send("Server recorded successfully");

});

app.post('/redirect/', (req, res) => {

	console.log("REDIRECTING....");
	var prevUrl = req.body.url;
	var videoId = req.body.file;
	
	console.log(videoId);
	var v_ref = firebase.database().ref("videoData/"+videoId);
	var required_servers= [];

	v_ref.once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var childKey = childSnapshot.val();
			required_servers.push(childKey);
			//console.log(childKey);
			//console.log(required_servers);
    	});

    	console.log("here");
		console.log(required_servers);


		var min = max_load_per_server;
		var newUrl = "";
		for (server in required_servers){
			console.log(required_servers[server]);
			if(min > local_servers_map[required_servers[server]].load){
				min = local_servers_map[required_servers[server]].load;
				newUrl = local_servers_map[required_servers[server]].url;
			}
		}
		console.log(newUrl+"/videos/"+videoId);
		local_servers_map[newUrl].load++;
		local_servers_map[prevUrl].load--;
		res.send(newUrl+"/videos/"+videoId);

	});
	
});
