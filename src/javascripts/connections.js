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
    var firstConnection = this.firstConnection();

    if (firstConnection && firstConnection.get('autoConnect')) {
      this.handleConnect(0);
    }
  },

  firstConnection: function() {
    var connections = this.cursors.connections.get();
    
    if (connections && 0 === connections.length) {
      this.addNewConnection();
    }

    return this.cursors.connections.select(0);
  },

  handleConnect: function(index, ev) {
    var cursor = this.cursors.connections.select(index);
    if (cursor) {
      if (cursor.get('loggedIn') && this.state.connectionAttempts > 0) {
        centralDispatch.client.disconnect();
      } else {
        var opts = {
          transport: 'bosh',
          boshURL: cursor.get('boshUrl'),

          jid: cursor.get('jid'),
          password: cursor.get('password')
        };

        centralDispatch.client.connect(opts);
        this.setState({connectionAttempts: this.state.connectionAttempts+1});
      }
    }
  },
  
  handleBoshUrlValidation: function(index, ev) {
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
    //TODO
  },

  addNewConnection: function(_ev) {
    var newId = uuid.v1();
    var newConnection = {
      id: newId,
      jid: newId + '@' + this.props.boshHost,
      password: 'qwerty',
      autoConnect: true,
      boshUrl: "http://" + this.props.boshHost + ":" + this.props.boshPort + "/http-bind"
    };

    this.cursors.connections.push(newConnection);
    stateTree.commit();

    return newConnection;
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
        <input type="button" value="!" onClick={this.handleConnect.bind(this, index)}/>
        <input type="button" value="-" onClick={this.removeConnection.bind(this, index)}/>
      </li>
    );
  },

  render: function() {
    //<input type="button" value="+" onClick={this.addNewConnection}/>
    return (
      <form onSubmit={this.onConnect} className="connect">
        <ul>
          {this.cursors.connections.get().map(this.renderConnection)}
        </ul>
      </form>
    );
  }
});

module.exports = Connections;
