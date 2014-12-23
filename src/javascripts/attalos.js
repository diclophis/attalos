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

    //TODO: figure out a better way to manage global state?
    defaultState.connectionComponent = <Connect key="connect" />;

    return defaultState;
  },

  componentDidMount: function() {
    centralDispatch.addLoginLogoutHandler(this, this.onLoggedInOrOut);
    centralDispatch.addPopStateHandler(this, this.onPopState);

  },

  onPopState: function(ev) {
    var foo = centralDispatch.getControllerFromHash();
    this.setState(foo);
  },

  onLoggedInOrOut: function(loggedIn) {
    this.setState({ loggedIn: loggedIn });
  },

  render: function() {
    var mainViewComponent = null;

    switch (this.state.controller) {
      case 'join-room':
        mainViewComponent = <JoinRoom key="join-room" />;
        break;

      case 'list-rooms':
        console.log(this.state.connectionComponent, "!!!!");
        mainViewComponent = <ListRooms key="list-rooms" />;
        break;

      case 'room':
        mainViewComponent = <Room key="room" id={this.state.id} nick={this.state.nick} />;
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
