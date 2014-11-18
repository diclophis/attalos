//

//var EventEmitter = require('events').EventEmitter;
var C2SServer = require('node-xmpp-server').C2SServer;
var Message = require('node-xmpp-core').Stanza.Message

// Sets up the server.
var c2s = new C2SServer({
  domain: 'localhost'
  //port: process.env.PORT || 5222;
});

var clients = new Array();

// On Connect event. When a client connects.
c2s.on('connect', function(client) {

  // That's the way you add mods to a given server.
  // Allows the developer to register the jid against anything they want
  c2s.on('register', function(opts, cb) {
    console.log('REGISTER');
    cb(true);
  });

  // Allows the developer to authenticate users against anything they want.
  client.on('authenticate', function(opts, cb) {
    console.log('AUTH', opts.jid);
    cb(null, opts); // cb(false)
  });

  client.on('online', function() {
    console.log('ONLINE');
    clients.push(this);
    //client.send(new Message({ type: 'chat' }).c('body').t('Hello there, little client.'));
  });

  // Stanza handling
  client.on('stanza', function(stanza) {
    console.log('STANZA', clients.length, stanza);
    for (var i=0; i<clients.length; i++) {
      var client = clients[i];
      if (this != client) {
        client.send(stanza);
      }
    }
  });

  // On Disconnect event. When a client disconnects
  client.on('disconnect', function() {
    console.log('DISCONNECT');
  });

});

console.log(c2s);
