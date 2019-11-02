const express = require('express');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const expressJwt = require('express-jwt');
const path = require('path');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

// app.use('/secure', expressJwt({
// 	secret: cred.jwtSecret,
// 	getToken: function fromCookieorHeader (req) {
// 	    if (req.get("Authorization") && req.get("Authorization").split(' ')[0] === 'Bearer') {
// 		console.log(req.get("Authorization").split(' ')[1])
//        		 return req.get("Authorization").split(' ')[1];
//     } else if (req.cookies && req.cookies.jtoken) {
//       return req.cookies.jtoken;
//     }
//     return null;
//   }
// }));

app.use(function(err, req, res, next) {
if(err.name === 'UnauthorizedError') {
 console.log('Unauthorized token!');
 req.user = false;
}
next();
});

app.use(express.static(__dirname + '/client'));

// Basic usage
mongoose.connect('mongodb://127.0.0.1:27017/orola');
mongoose.connection.on('connected',()=>{
    console.log("Connected to database mongodb @ 27017")
});
mongoose.connection.on('error',(err)=>{
    console.log("Error in database connection: "+err)
});
require('./server/routes/route')(app);

// require('./server/routes/doctor')(app);
// require('./server/routes/user')(app);

app.get('/', function(req, res) {
    res.send("Hello")
	// res.sendFile(path.resolve('./client/index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});