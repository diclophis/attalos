var React = require('react');
var mui = require('material-ui'),
    Input = mui.Input,
    PaperButton = mui.PaperButton;
var debug = require('debug');
var xmpp = require('stanza.io'); // if using browserify

debug.enable('*');

var AttalosCreateRoom = React.createClass({
  onCreatedRoom: function() {

var client = xmpp.createClient({
    jid: 'echobot@localhost',
    password: 'password',
    transport: 'bosh',
    boshURL: 'http://localhost:5280/http-bind/'
});

client.on('session:started', function () {
    client.getRoster();
    client.sendPresence();
    console.log("wtf");
});

client.on('chat', function (msg) {
    client.sendMessage({
      to: msg.from,
      body: 'You sent: ' + msg.body
    });
});

var foo = client.connect();
console.log("wtf2", foo);

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
