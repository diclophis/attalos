var express = require('express'),
    app = express();

var spawn = require('child_process').spawn;

//app.all(__dirname + '/public', function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "X-Requested-With");
//  next();
//});

app.use(function(req, res, next) {

  var isDev = (req.url.indexOf('dev.html') != -1);

  if (isDev) {
    var make = spawn('make');

    make.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    make.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    make.on('close', function (code) {
      console.log('child process exited with code ' + code);
      next();
    });
  } else {
    next();
  }
});

app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3001;
var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);
