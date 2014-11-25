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
    var autoConnect = true;

    if (typeof(window) === 'undefined') {
    } else {
      // window.client = client;

      parts = url.parse(window.location.toString());
      parts.port = parseInt(parts.port) + 200;

      //TODO: add toBoolean
      var fromSession = sessionStorage.getItem("autoConnect")
      if (fromSession) {
        autoConnect = fromSession === "true";
      }
    }

    var boshUrl = 'http://' + parts.hostname + ':' + parts.port + '/http-bind';

    if (typeof(sessionStorage) != 'undefined') {
    console.log(sessionStorage);
      sessionStorage.setItem("autoConnect", autoConnect);
    }

    var jid = 'local-user@localhost';
    var password = 'totally-secret';

    return {
      loggedIn: false,
      isConnecting: false,
      autoConnect: autoConnect,
      jid: jid,
      password: password,
      boshUrl: boshUrl,
      client: client
    };
  },

  onSessionStarted: function () {
    console.log("connected");

    //this.state.client.getRoster();
    //this.state.client.sendPresence();

    this.setState({ loggedIn: true })

    vent.emit("login", true);
  },

  onSessionDisconnected: function () {
    console.log("disconnected");

    this.setState({ loggedIn: false, isConnecting: false })

    vent.emit("logout", false);
  },

  onChat: function(msg) {
    vent.emit("recv", msg);
  },

  willSendChat: function(msg) {
    this.state.client.sendMessage(msg);
  },

  willJoinRoom: function(id) {
    //this.listenTo(window.client, '*', this.didReceiveMessage);
    //window.client.getDiscoItems('conference.error0.xmpp.slack.com', null, function(a, b, c) {
    //  console.log("SADASD", a, b, c);
    //});

    //console.log("JOIN", id, this.state.client.jid.local);

    if (this.state.loggedIn) {
      this.state.client.joinRoom(id, this.state.client.jid.local);
    } else {
      console.warn("!loggedIn");
      //TODO: figure out the semantics of this memory leak
      //throw new Error('notLoggedIn');
      //var stateBridge = this.state;
      //vent.once("login", function(_) {
      //  stateBridge.client.joinRoom(id, stateBridge.client.jid.local);
      //});
    }
  },

  onDebug: function(a, b) {
    //console.log(a, b);
  },

  componentDidMount: function() {
    this.listenTo(this.state.client, 'session:started', this.onSessionStarted);
    this.listenTo(this.state.client, 'disconnected', this.onSessionDisconnected);
    this.listenTo(this.state.client, 'chat', this.onChat);
    this.listenTo(this.state.client, 'groupchat', this.onChat);
    this.listenTo(this.state.client, '*', this.onDebug);

    this.listenTo(vent, 'send', this.willSendChat);
    this.listenTo(vent, 'room:join', this.willJoinRoom);

    if (this.state.autoConnect) {
      this.connect();
    }
  },

  connect: function() {
    var opts = {
      jid: this.state.jid,
      password: this.state.password,
      transport: 'bosh',
      boshURL: this.state.boshUrl
    };

    console.log('connectin', opts);

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

  handleJidValidation: function(ev) {
    this.setState({ jid: ev.target.value });
  },

  handlePasswordValidation: function(ev) {
    this.setState({ password: ev.target.value });
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
        <div className="connect">
          jid:
          <input id="jid" defaultValue={this.state.jid} onChange={this.handleJidValidation} disabled={this.state.isConnecting}></input>
          password:
          <input id="password" type="password" defaultValue="{this.state.password}" onChange={this.handlePasswordValidation} disabled={this.state.isConnecting}></input>
          bosh:
          <input id="bosh-url" defaultValue={this.state.boshUrl} onChange={this.handleBoshUrlValidation} disabled={this.state.isConnecting}></input>
          <button disabled={this.state.isConnecting}>CONNECT</button>
          <label htmlFor="auto-connect">
            auto-connect?
          </label>
          <input id="auto-connect" type="checkbox" defaultChecked={this.state.autoConnect} onChange={this.handleAutoConnectValidation} disabled={this.state.isConnecting}></input>
          <label htmlFor="connected">
            currently-connected?
          </label>
          <input id="connected" type="checkbox" checked={this.state.loggedIn} onChange={this.handleConnectedValidation} disabled={!this.state.isConnecting}></input>
        </div>
      </form>
    );
  }
});

module.exports = Connect;
