var React = require('react');
var url = require('url');
var centralDispatch = require('./central-dispatch').singleton;
var listenTo = require('react-listento');

var Connect = React.createClass({
  mixins: [listenTo],

  getDefaultProps: function() {
    return {
      roomMenuItems: []
    };
  },

  getInitialState: function() {
    var parts = { hostname: 'localhost', port: 5200 };
    var autoConnect = true;
    var jid = 'local-user@localhost';
    var password = 'totally-secret';

    if (typeof(window) === 'undefined') {
    } else {
      parts = url.parse(window.location.toString());
      parts.port = parseInt(parts.port) + 200;

      //TODO: add toBoolean
      var fromSession = sessionStorage.getItem("autoConnect");
      if (fromSession) {
        autoConnect = fromSession === "true";
      }

      fromSession = sessionStorage.getItem("jid");
      if (fromSession) {
        jid = fromSession;
      }

      fromSession = sessionStorage.getItem("password");
      if (fromSession) {
        password = fromSession;
      }
    }

    var boshUrl = 'http://' + parts.hostname + ':' + parts.port + '/http-bind';

    if (typeof(sessionStorage) != 'undefined') {
      sessionStorage.setItem("autoConnect", autoConnect);
      sessionStorage.setItem("jid", jid);
      sessionStorage.setItem("password", password);
    }

    roomMenuItems = [
    ];

    return {
      loggedIn: false,
      isConnecting: false,
      autoConnect: autoConnect,
      jid: jid,
      password: password,
      boshUrl: boshUrl,
      roomMenuItems: roomMenuItems
    };
  },

  onSessionStarted: function () {
    //this.state.client.getRoster();
    //this.state.client.sendPresence();

    this.setState({ loggedIn: true })

    centralDispatch.login(true);
  },

  onSessionDisconnected: function () {
    this.setState({ loggedIn: false, isConnecting: false })

    centralDispatch.logout(false);
  },

  onChat: function(msg) {
    centralDispatch.message(msg);
  },

  willSendChat: function(msg) {
    centralDispatch.client.sendMessage(msg);
  },

  gotRoomRoster: function(ev) {
    //console.log("roster!", ev, this);
  },

  willJoinRoom: function(id) {
    //this.listenTo(window.client, '*', this.didReceiveMessage);
    //window.client.getDiscoItems('conference.error0.xmpp.slack.com', null, function(a, b, c) {
    //  console.log("SADASD", a, b, c);
    //});

    console.log("willJoinRoom", id, this.state);

    if (this.state.loggedIn) {
      centralDispatch.client.joinRoom(id, centralDispatch.client.jid.local);
      // broken in slack! this.state.client.getRoomMembers(id, null, this.gotRoomRoster);
    } else {
    }
  },

  onDebug: function(a, b) {
    //console.log(a, b);
  },

  onPresence: function(msg) {
    //TODO: better check here
    if (msg.from.domain.indexOf("conference") != -1) {
      //console.log("joined:room", msg.from.toString(), msg);
      centralDispatch.joinedRoom(msg);
    } else {
      //console.log("presence", msg.from.toString(), msg);
    }

    //TODO: figure out more presence info like list of rooms
    //console.log(msg.from.resource);
    //this.setProps({roomMenuItems: (this.props.roomMenuItems || []).concat({ payload: '?controller=room&id=' + msg.from.toString(), text: msg.from.local })});
  },

  componentDidMount: function() {
    //TODO: figure out a better factorization of this
    this.listenTo(centralDispatch.client, 'session:started', this.onSessionStarted);
    this.listenTo(centralDispatch.client, 'disconnected', this.onSessionDisconnected);
    this.listenTo(centralDispatch.client, 'chat', this.onChat);
    this.listenTo(centralDispatch.client, 'groupchat', this.onChat);
    //this.listenTo(this.state.client, 'available', this.onAvailable);
    this.listenTo(centralDispatch.client, 'presence', this.onPresence);
    this.listenTo(centralDispatch.client, '*', this.onDebug);

    this.listenTo(centralDispatch, 'send', this.willSendChat);
    this.listenTo(centralDispatch, 'room:join', this.willJoinRoom);

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

    centralDispatch.client.connect(opts);
    this.setState({ isConnecting: true });
  },

  onConnect: function(ev) {
    ev.preventDefault();

    this.connect();
  },

  componentWillUnmount: function() {
    //console.log("FUUUU");
  },

  handleBoshUrlValidation: function(ev) {
    var parts = url.parse(ev.target.value);
    var boshUrl = 'http://' + (parts.hostname) + ':' + (parts.port) +  '/http-bind';

    this.setState({boshUrl: boshUrl });
  },

  handleJidValidation: function(ev) {
    sessionStorage.setItem("jid", ev.target.value);
    this.setState({ jid: ev.target.value });
  },

  handlePasswordValidation: function(ev) {
    sessionStorage.setItem("password", ev.target.value);
    this.setState({ password: ev.target.value });
  },

  handleAutoConnectValidation: function(ev) {
    sessionStorage.setItem("autoConnect", ev.target.checked);
  },

  handleConnectedValidation: function(ev) {
    if (!ev.target.checked) {
      centralDispatch.client.disconnect();
    }
  },

  render: function() {
    return (
      <form onSubmit={this.onConnect} className="connect">
        <ul>
          <li>
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
          </li>
        </ul>
      </form>
    );
  }
});

module.exports = Connect;
