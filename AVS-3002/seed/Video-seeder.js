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
var database = firebase.database();
var vnames = ["nodejs","express","html","css","mongo","mongodb","nodemon","common mistakes","model view"];
var tags = ["education","web-development","beginner"];
function writeVideoData(videoId, vname, tags) {
  firebase.database().ref('videos/' + videoId).set({
    Vname: vname,
    tags: tags,
  });
}
for(var i=0;i<9;++i)
  writeVideoData(i,vnames[i]+" tutorial",tags);