// listens for XMPP connections, and dispatches events based on stanza data

var C2SServer = require('node-xmpp-server').C2SServer;
var Message = require('node-xmpp-core').Stanza.Message;

// Sets up the server.
var c2s = new C2SServer({
  domain: 'localhost',
  port: process.env.PORT || 5222
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
  });

  // Stanza handling
  client.on('stanza', function(stanza) {
    console.log(stanza);

    var fff = stanza.getFrom();
    var ttt = stanza.getTo();
    console.log(fff, ttt);

    // This re-broadcasts the stanza to all connected clients, in effect creating an echo chamber
    // at some point this will be replaced with specific logic based on different XEPs
    for (var i=0; i<clients.length; i++) {
      var client = clients[i];
      var msg = null;

      //if (stanza.name != "presence" && stanza.name != "message") {
      if (stanza.from.indexOf("rtc") != -1) {
        msg = new Message({type: stanza.type});
      } else if (stanza.name == "presence") {
        msg = new Message({ type: stanza.type, from: stanza.to });
      } else {
        msg = new Message({ type: stanza.type, from: stanza.to + "/" + fff.user });
      }

      console.log(msg);

      msg.c('body').t(stanza.getChildText('body'));
      client.send(msg);
    }
  });

  // On Disconnect event. When a client disconnects
  client.on('disconnect', function() {
    console.log('DISCONNECT');
  });

});

console.log('Listening on port: ' + c2s.options.port);
