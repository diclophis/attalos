// primary entry point

var React = require('react');
var Anchor = require('./anchor');
var Connect = require('./connect');
var JoinRoom = require('./join-room');
var ListRooms = require('./list-rooms');
var Room = require('./room');
var centralDispatch = require('./central-dispatch').singleton;
var listenTo = require('react-listento');

var AttalosComponent = React.createClass({
  mixins: [listenTo],

  getInitialState: function() {
    var defaultState = centralDispatch.getControllerFromHash();

    defaultState.roomLinks = [];
    defaultState.messages = {};

    //TODO: figure out a better way to manage global state?
    defaultState.connectionComponent = <Connect key="connect" />;

    return defaultState;
  },

  componentDidMount: function() {
    centralDispatch.addLoginLogoutHandler(this, this.onLoggedInOrOut);
    centralDispatch.addPopStateHandler(this, this.onPopState);

    this.listenTo(centralDispatch, 'recv', this.didReceiveMessage);
    //this.listenTo(centralDispatch, 'joined:room', this.didJoinRoom);
  },

  didReceiveMessage: function(msg, _) {
    if (msg.from && msg.body) {
      var newState = {};
      newState[msg.from.bare+'.joined'] = true;
      var a = (this.state[msg.from.bare] || [])
      a.unshift(msg.body);
      newState[msg.from.bare] = a;
      this.setState(newState);
    } else {
      //console.log("?????", msg);
    }
  },

/*
  didJoinRoom: function(msg, _) {
    console.log("joined this room?", msg, centralDispatch.client);
    if (msg.from.bare == this.props.id) {
      if (msg.from.resource == centralDispatch.client.jid.local) {
        this.setState({meJoinedRoom: true});
      } else {
        console.log(msg.from.resource, "joined", this.props.id);
      }
    }
  },
*/

  onPopState: function(ev) {
    var foo = centralDispatch.getControllerFromHash();
    this.setState(foo);
  },

  onLoggedInOrOut: function(loggedIn) {
    this.setState({ loggedIn: loggedIn });
  },

  componentDidUpdate: function() {
    if (this.state.controller == "room") {
      if (!this.state[this.state.id+'.joined']) {
        //console.log("!@#", this.state);
        centralDispatch.joinRoom(this.state.id);
      }
    }
  },

  render: function() {
    var mainViewComponent = null;

    switch (this.state.controller) {
      case 'join-room':
        mainViewComponent = <JoinRoom key="join-room" />;
        break;

      case 'list-rooms':
        mainViewComponent = <ListRooms key="list-rooms" />;
        break;

      case 'room':
        mainViewComponent = <Room key="room" id={this.state.id} nick={this.state.nick} messages={this.state[this.state.id] || ["Please Wait ..."]} joined={this.state[this.state.id+'.joined']}/>;
        break;

      default:
    }

    var extraAnchor = null;

    if (this.state.id && this.state.controller == 'room') {
      extraAnchor = <Anchor href={"?controller=room&id=" + this.state.id}><h2>{this.state.id}</h2></Anchor>;
    }

    if (!this.state.loggedIn) {
      mainViewComponent = null;
    }

    var bootstrappedComponents = [];

    if (this.props.bootstrapped) {
      bootstrappedComponents.push(this.state.connectionComponent);
      bootstrappedComponents.push(mainViewComponent);
    }

    return (
      <div className={this.state.loggedIn ? 'authenticated' : 'restricted'}>
        <div className="primary-anchors">
          <a href="?">#</a>
          <ul>
            <li>
              <Anchor href="?controller=list-rooms">LIST-ROOMS</Anchor>
            </li>
            <li>
              <Anchor href="?controller=join-room">JOIN-ROOM</Anchor>
            </li>
          </ul>
          {extraAnchor}
        </div>
        {bootstrappedComponents}
      </div>
    );
  }
});

module.exports = AttalosComponent;
