var React = require('react');
var url = require('url');
var centralDispatch = require('./central-dispatch').singleton;
var stateTree = require('./state-tree');

var Connections = React.createClass({
  mixins: [stateTree.mixin],
  cursors: [['defaults', 'connections']],
  
/*
  getInitialState: function() {
    var parts = { hostname: 'localhost', port: 5200 };
    parts = url.parse(window.location.toString());
    parts.port = parseInt(parts.port) + 200;

    var autoConnect = false;
    var jid = 'local-user@' + parts.hostname;
    var password = 'totally-secret';

    //if (typeof(window) === 'undefined') {
    //} else {

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
    //}

    var boshUrl = 'http://' + parts.hostname + ':' + parts.port + '/http-bind';

    if (typeof(sessionStorage) != 'undefined') {
      sessionStorage.setItem("autoConnect", autoConnect);
      sessionStorage.setItem("jid", jid);
      sessionStorage.setItem("password", password);
    }

    return {
      loggedIn: false,
      isConnecting: false,
      autoConnect: autoConnect,
      jid: jid,
      password: password,
      boshUrl: boshUrl
    };
  },
*/

/*
  componentDidMount: function() {
    if (this.state.autoConnect) {
      this.connect();
    }
  },
*/

/*
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
*/

  handleBoshUrlValidation: function(ev) {
    var parts = url.parse(ev.target.value);
    var boshUrl = 'http://' + (parts.hostname) + ':' + (parts.port) +  '/http-bind';

    this.setState({boshUrl: boshUrl});
  },

  handleJidValidation: function(ev) {
    //sessionStorage.setItem("jid", ev.target.value);
    this.setState({jid: ev.target.value});
  },

  handlePasswordValidation: function(ev) {
    //sessionStorage.setItem("password", ev.target.value);
    this.setState({ password: ev.target.value });
  },

  handleAutoConnectValidation: function(ev) {
    //sessionStorage.setItem("autoConnect", ev.target.checked);
  },

  handleConnectedValidation: function(ev) {
    //if (!ev.target.checked) {
    //  centralDispatch.client.disconnect();
    //}
  },

  addNewConnection: function() {
    this.cursors[0].push({});
  },

  renderConnection: function(connection, index) {
    return (
      <li key={index}>
        #{index}
        &nbsp;
        jid:
        <input className="jid" defaultValue={connection.jid} onChange={this.handleJidValidation} disabled={connection.isConnecting}></input>
        password:
        <input className="password" type="password" defaultValue="{connection.password}" onChange={this.handlePasswordValidation} disabled={connection.isConnecting}></input>
        bosh:
        <input className="bosh-url" defaultValue={connection.boshUrl} onChange={this.handleBoshUrlValidation} disabled={connection.isConnecting}></input>
        <button disabled={connection.isConnecting}>CONNECT</button>
        <label htmlFor="auto-connect">
          auto-connect?
        </label>
        <input className="auto-connect" type="checkbox" defaultChecked={connection.autoConnect} onChange={this.handleAutoConnectValidation} disabled={connection.isConnecting}></input>
        <label htmlFor="connected">
          currently-connected?
        </label>
        <input className="connected" type="checkbox" checked={connection.loggedIn} onChange={this.handleConnectedValidation} disabled={!connection.isConnecting}></input>
      </li>
    );
  },


  render: function() {
    return (
      <form onSubmit={this.onConnect} className="connect">
        <input type="button" value="+" onClick={this.addNewConnection}/>
        <ul>
          {this.cursors[0].get().map(this.renderConnection)}
        </ul>
      </form>
    );
  }
});

module.exports = Connections;
