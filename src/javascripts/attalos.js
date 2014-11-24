// primary entry point

var React = require('react');
var Anchor = require('./anchor');
var Connect = require('./connect');
var JoinRoom = require('./join-room');
var ListRooms = require('./list-rooms');
var Room = require('./room');
var vent = require('./vent').vent;
var url = require('url');
var listenTo = require('react-listento');
var slug = require('./slug');

//TODO: move to module, or internalize
var getControllerFromHash = function() {
  var newController = null;
  var newId = null;

  if (typeof(window) != 'undefined') {
    var parts = url.parse(window.location.toString(), true);
    if (parts.query.controller) {
      newController = slug(parts.query.controller, 16);
    }

    if (parts.query.id) {
      newId = slug(parts.query.id, 64);
    }
  }

  return {
    controller: newController,
    action: 'index',
    id: newId
  };
};


var AttalosComponent = React.createClass({
  mixins: [listenTo],

  getInitialState: function() {
    var defaultState = getControllerFromHash();

    defaultState.roomLinks = [];

    //TODO: figure out a better way to manage global state?
    defaultState.connectionComponent = <Connect />;

    return defaultState;
  },

  componentDidMount: function() {
    this.listenTo(vent, 'login', this.onLoggedInOrOut);
    this.listenTo(vent, 'logout', this.onLoggedInOrOut);
    this.listenTo(vent, 'popstate', this.onPopState);
    this.listenTo(window, 'popstate', this.onPopState);
  },

  onPopState: function(ev) {
    //console.log("popstate", this.state, ev, history.state);
    var foo = getControllerFromHash();
    this.setState(foo);
  },

  onLoggedInOrOut: function(loggedIn) {
    this.setState({ loggedIn: loggedIn });
  },

  render: function() {
    var mainViewComponent = null;

    switch (this.state.controller) {
      case 'join-room':
        mainViewComponent = <JoinRoom />;
        break;

      case 'list-rooms':
        mainViewComponent = <ListRooms />;
        break;

      case 'room':
        mainViewComponent = <Room id={this.state.id} client={this.state.connectionComponent} />;
        break;

      default:
    }

    var extraAnchor = null;

    if (this.state.id && this.state.controller == 'room') {
      extraAnchor = <Anchor href={"?controller=room&id=" + this.state.id}>{this.state.id.toUpperCase()}</Anchor>;
    }

    return (
      <div className={this.state.loggedIn ? 'authenticated' : 'restricted'}>
        <div className="primary-anchors">
          <a href="?">#</a>
          <Anchor href="?controller=list-rooms">LIST ROOMS</Anchor>
          <Anchor href="?controller=join-room">JOIN ROOM</Anchor>
          {extraAnchor}
        </div>
        {this.state.connectionComponent}
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
