var React = require('react');
var xmpp = require('stanza.io');
var url = require('url');
var vent = require('./vent').vent;

var Connect = React.createClass({
/*
  onCreatedRoom: function(ev) {
    ev.preventDefault();

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
*/
  getInitialState: function() {
    var client = xmpp.createClient({
      jid: null,
      password: 'password',
      transport: 'bosh',
      //useStreamManagement: true,
      boshURL: null
    });

    client.on('session:started', function () {
      client.getRoster();
      client.sendPresence();
      //client.sendMessage({
      //  to: client.jid,
      //  body: 'I just joined sent'
      //});
      console.log("connected");

      vent.emit("login", true);
    });

    client.on('disconnected', function () {
      console.log("disconnected");

      vent.emit("logout", false);
    });

    return {
      client: client
    };
  },
  getDefaultProps: function() {
    // Parse the URL of the current location
    var parts = { hostname: 'localhost', port: 5200 };

    if (typeof(window) === 'undefined') {
    } else {
      parts = url.parse(window.location.toString());
      parts.port = parseInt(parts.port) + 200;
    }
    
    return {
      boshUrl: 'http://foo@' + parts.hostname + ':' + parts.port
    };
  },
  onConnect: function(ev) {
    ev.preventDefault();

    var parts = url.parse(document.getElementById("bosh-url").value);
    var jid = parts.auth + '@' + parts.hostname;
    var boshUrl = 'http://' + (parts.hostname) + ':' + (parts.port) +  '/http-bind';

    this.state.client.config.boshURL = boshUrl;
    this.state.client.config.jid = jid;
    this.state.client.connect();

    this.setState({client: this.state.client, isConnecting: true});
  },
  render: function() {
    return (
      <form onSubmit={this.onConnect}>
        <input id="bosh-url" type="text" defaultValue={this.props.boshUrl} />
        <button disabled={this.state.isConnecting}>CONNECT</button>
      </form>
    );
  }
});

module.exports = Connect;