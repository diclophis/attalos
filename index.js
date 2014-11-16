var PeerServer = require('peer').PeerServer,
    express = require('express'),
    //Topics = require('./public/src/Topics.js'),
    app = express(),
    port = process.env.PORT || 3001;

app.use(express.static(__dirname + '/public'));

var expressServer = app.listen(port);
var io = require('socket.io').listen(expressServer);

console.log('Listening on port', port);

//var peerServer = new PeerServer({ port: 9000, path: '/chat' });

//peerServer.on('connection', function (id) {
//  io.emit(Topics.USER_CONNECTED, id);
//  console.log('User connected with #', id);
//});

//peerServer.on('disconnect', function (id) {
//  io.emit(Topics.USER_DISCONNECTED, id);
//  console.log('User disconnected with #', id);
//});
