var React = require('react');

var CreateRoom = React.createClass({
  onCreatedRoom: function(ev) {
    ev.preventDefault();

    var xmpp = require('stanza.io');

    var client = xmpp.createClient({
      jid: 'foo@localhost',
      password: 'password',
      transport: 'bosh',
      boshURL: 'http://localhost:5280/http-bind/'
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
        <input name="room" type="text" placeholder="name of room" />
        <button>CREATE ROOM</button>
      </form>
    );
  }
});

module.exports = CreateRoom;
