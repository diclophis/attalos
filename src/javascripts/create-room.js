var React = require('react');

var CreateRoom = React.createClass({
  onCreatedRoom: function(ev) {
    ev.preventDefault();

    var xmpp = require('stanza.io');
    var url = require('url');
    // Parse the URL of the current location
    var parts = url.parse(window.location.toString());
    // Log the parts object to our browser's console
    console.log(parts);

    var client = xmpp.createClient({
      jid: 'foo@' + parts.hostname,
      password: 'password',
      transport: 'bosh',
      boshURL: 'http://' + (parts.hostname) + ':' + (document.getElementById("bosh-port").value) +  '/http-bind/'
    });

    client.on('session:started', function () {
      client.getRoster();
      client.sendPresence();
      client.sendMessage({
        to: client.jid,
        body: 'I just joined sent'
      });
      console.log("session:started");
    });

    client.on('chat', function (msg) {
      console.log("onChat", msg);
      client.sendMessage({
        to: msg.from,
        body: 'echo echo'
      });
    });

    client.connect();

  },
  render: function() {
    return (
      <form onSubmit={this.onCreatedRoom}>
        <input id="bosh-port" type="text" placeholder="" />
        <input name="room" type="text" placeholder="name of room" />
        <button>CREATE ROOM</button>
      </form>
    );
  }
});

module.exports = CreateRoom;
