var express = require('express'),
    app = express();

//app.all(__dirname + '/public', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  next();
//});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With, Set-Cookie");
  res.header("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  res.header('Access-Control-Max-Age', "14400");
  next();
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3001;
var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);
