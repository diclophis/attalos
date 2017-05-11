// serves static files, in dev also re-makes project

var express = require('express');
var spawn = require('child_process').spawn;


var app = express();

/*
// run make to update if request is for development
app.use(function(req, res, next) {
  var isDev = (req.url.indexOf('dev.html') != -1);

  //(req.url.indexOf('index.html') != -1);
  var isDist = false;
  var makeDist = '';

  if (isDev) {
    makeDist = 'dev';
  }

  if (isDist) {
    makeDist = 'dist';
  }

  if (isDev || isDist) {
    var make = spawn('make', [makeDist]);
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
        res.send('<pre>' + standardError + '</pre>');
      }
    });
  } else {
    next();
  }
});
*/

// serve all files from public dir using built-in static file server
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3001;
var expressServer = app.listen(port);

console.log('Listening for web on port', port);
