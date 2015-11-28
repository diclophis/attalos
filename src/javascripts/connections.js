var React = require('react');
var url = require('url');
var centralDispatch = require('./central-dispatch').singleton;
var stateTree = require('./state-tree');
var uuid = require('node-uuid');

var Connections = React.createClass({
  mixins: [stateTree.mixin],
  cursors: {
    connections: ['defaults', 'connections']
  },

  getInitialState: function() {
    return({connectionAttempts: 0});
  },

  componentDidMount: function() {
    //centralDispatch.client.disconnect();
    var cursor = this.cursors.connections.select(0);
    if (cursor && cursor.get('autoConnect')) {
    //console.log(this.cursors.connections.length);
    //  //cursor.set('loggedIn', false);
    //  cursor.update({'loggedIn': false});
      this.handleConnect(0);
    }
  },

  handleConnect: function(index, ev) {
    var cursor = this.cursors.connections.select(index);
    if (cursor) {
      if (cursor.get('loggedIn') && this.state.connectionAttempts > 0) {
        console.log("FOO");
        centralDispatch.client.disconnect();
      } else {
        var opts = {
          //transport: 'websocket',
          //wsURL: cursor.get('boshUrl'),

          transport: 'bosh',
          boshURL: cursor.get('boshUrl'),

          jid: cursor.get('jid'),
          password: cursor.get('password')
        };

        console.log(opts);

        centralDispatch.client.connect(opts);
        this.setState({connectionAttempts: this.state.connectionAttempts+1});
      }
    }
  },
  
  handleBoshUrlValidation: function(index, ev) {
    //var parts = url.parse(ev.target.value);
    //var boshUrl = 'http://' + (parts.hostname) + ':' + (parts.port) +  '/http-bind';
    var cursor = this.cursors.connections.select(index);
    cursor.update({
      boshUrl: {
        $set: ev.target.value
      }
    });

    stateTree.commit();
  },

  handleJidValidation: function(index, ev) {
    var cursor = this.cursors.connections.select(index);
    cursor.update({
      jid: {
        $set: ev.target.value
      }
    });

    stateTree.commit();
  },

  handlePasswordValidation: function(index, ev) {
    var cursor = this.cursors.connections.select(index);
    cursor.update({
      password: {
        $set: ev.target.value
      }
    });
  },

  handleAutoConnectValidation: function(index, ev) {
    var cursor = this.cursors.connections.select(index);
    cursor.update({
      autoConnect: {
        $set: ev.target.checked
      }
    });
  },

  handleConnectedValidation: function(ev) {
  },

  addNewConnection: function(ev) {
    var newId = uuid.v1();
    this.cursors.connections.push({
      id: newId,
      jid: newId + '@' + this.props.boshHost,
      password: 'qwerty',
      autoConnect: false,
      boshUrl: "http://" + this.props.boshHost + ":" + this.props.boshPort + "/http-bind"
    });
  },

  removeConnection: function(index, ev) {
    this.cursors.connections.select(index).remove();
  },

  renderConnection: function(connection, index) {
    return (
      <li key={connection.id}>
        jid:
        <input className="jid" defaultValue={connection.jid} onChange={this.handleJidValidation.bind(this, index)} disabled={connection.isConnecting}></input>
        password:
        <input className="password" type="password" defaultValue={connection.password} onChange={this.handlePasswordValidation.bind(this, index)} disabled={connection.isConnecting}></input>
        bosh:
        <input className="bosh-url" defaultValue={connection.boshUrl} onChange={this.handleBoshUrlValidation.bind(this, index)} disabled={connection.isConnecting}></input>
        <label htmlFor={"auto-connect-" + connection.id}>
          auto-connect?
        </label>
        <input id={"auto-connect-" + connection.id} className="auto-connect" type="checkbox" defaultChecked={connection.autoConnect} onChange={this.handleAutoConnectValidation.bind(this, index)} disabled={connection.isConnecting}></input>
        <label htmlFor="connected">
          currently-connected?
        </label>
        <input className="connected" type="checkbox" checked={connection.loggedIn} onChange={this.handleConnectedValidation} disabled={!connection.isConnecting}></input>
        <input type="button" value="=" onClick={this.handleConnect.bind(this, index)}/>
        <input type="button" value="-" onClick={this.removeConnection.bind(this, index)}/>
      </li>
    );
  },

  render: function() {
    return (
      <form onSubmit={this.onConnect} className="connect">
        <input type="button" value="+" onClick={this.addNewConnection}/>
        <ol>
          {this.cursors.connections.get().map(this.renderConnection)}
        </ol>
      </form>
    );
  }
});

module.exports = Connections;
