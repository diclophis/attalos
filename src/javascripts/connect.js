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


  componentDidMount: function() {
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
