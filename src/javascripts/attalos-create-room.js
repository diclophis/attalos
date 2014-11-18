var React = require('react');
var mui = require('material-ui'),
    Input = mui.Input,
    PaperButton = mui.PaperButton;
var debug = require('debug');
var xmpp = require('stanza.io');
var uuid = require('node-uuid');

var AttalosCreateRoom = React.createClass({
  onCreatedRoom: function() {

    var client = xmpp.createClient({
      jid: uuid.v4() + '@localhost',
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
      <form className="c6">
        <Input name="room" type="text" description="typically used as the topic of discussion" placeholder="name of room"/>
        <PaperButton onClick={this.onCreatedRoom} type={PaperButton.Types.FLAT} label="CREATE ROOM"/>
      </form>
    );
  }
});

module.exports = AttalosCreateRoom;
