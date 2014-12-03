var express = require('express'),
    app = express();

var spawn = require('child_process').spawn;

// run make to update if request is for development
app.use(function(req, res, next) {
  var isDev = (req.url.indexOf('dev.html') != -1);

  if (isDev) {
    var make = spawn('make');
    var standardError = new String();

    make.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    make.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
      standardError += data;
    });

    make.on('close', function (code) {
      console.log('child process exited with code ' + code);
      if (0 === code) {
        next();
      } else {
        res.send(standardError);
      }
    });
  } else {
    next();
  }
});

// serve all files from public dir using built-in static file server
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3001;
var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);
