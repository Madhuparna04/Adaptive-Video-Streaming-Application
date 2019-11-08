var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");
require("firebase/firestore");

function writeUserData(user_name,search_query)
{
    var userData = firebase.database().ref("UserData/");
    var userRef=userData.child(user_name);
    var queryRef=userRef.child("query");
    queryRef.push(search_query);
}
module.exports=writeUserData;