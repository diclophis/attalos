var React = require('react');
var xmpp = require('stanza.io');
var url = require('url');
var vent = require('./vent').vent;
var listenTo = require('react-listento');

var Connect = React.createClass({
  mixins: [listenTo],

  getInitialState: function() {

    var client = xmpp.createClient({
    });

    var parts = { hostname: 'localhost', port: 5200 };
    var autoConnect = false;

    if (typeof(window) === 'undefined') {
    } else {
      parts = url.parse(window.location.toString());
      parts.port = parseInt(parts.port) + 200;

      //TODO: add toBoolean
      autoConnect = sessionStorage.getItem("autoConnect") === "true";
    }

    var boshUrl = 'http://' + parts.hostname + ':' + parts.port + '/http-bind';
    
    return {
      loggedIn: false,
      isConnecting: false,
      autoConnect: autoConnect,
      boshUrl: boshUrl,
      client: client
    };
  },

  onSessionStarted: function () {
    console.log("connected");

    this.state.client.getRoster();
    this.state.client.sendPresence();
    this.setState({ loggedIn: true })

    vent.emit("login", true);
  },

  onSessionDisconnected: function () {
    console.log("disconnected");

    this.setState({ loggedIn: false, isConnecting: false })

    vent.emit("logout", false);
  },

  componentDidMount: function() {
    this.listenTo(this.state.client, 'session:started', this.onSessionStarted);
    this.listenTo(this.state.client, 'disconnected', this.onSessionDisconnected);

    if (this.state.autoConnect) {
      this.connect();
    }
  },

  connect: function() {
    var parts = url.parse(this.state.boshUrl);
    var jid = parts.auth + '@' + parts.hostname;

    var opts = {
      jid: jid,
      password: 'password',
      transport: 'bosh',
      boshURL: this.state.boshUrl
    };

    this.state.client.connect(opts);
    this.setState({ isConnecting: true });
  },

  onConnect: function(ev) {
    ev.preventDefault();

    this.connect();
  },

  componentWillUnmount: function() {
    console.log("FUUUU");
  },

  handleBoshUrlValidation: function(ev) {
    var parts = url.parse(ev.target.value);
    var boshUrl = 'http://' + (parts.hostname) + ':' + (parts.port) +  '/http-bind';

    this.setState({boshUrl: boshUrl });
  },

  handleAutoConnectValidation: function(ev) {
    sessionStorage.setItem("autoConnect", ev.target.checked);
  },

  handleConnectedValidation: function(ev) {
    if (!ev.target.checked) {
      this.state.client.disconnect();
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onConnect}>
        <input id="bosh-url" defaultValue={this.state.boshUrl} onChange={this.handleBoshUrlValidation} disabled={this.state.isConnecting}></input>
        <button disabled={this.state.isConnecting}>CONNECT</button>
        <input id="auto-connect" type="checkbox" defaultChecked={this.state.autoConnect} onChange={this.handleAutoConnectValidation} disabled={this.state.isConnecting}></input>
        <label htmlFor="auto-connect">
          auto-connect?
        </label>
        <input id="connected" type="checkbox" checked={this.state.loggedIn} onChange={this.handleConnectedValidation} disabled={!this.state.isConnecting}></input>
        <label htmlFor="connected">
          connected?
        </label>
      </form>
    );
  }
});

module.exports = Connect;
