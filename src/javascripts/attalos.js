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

//TODO: move to module, or internalize
var getControllerFromHash = function() {
  var newController = null;
  var newId = null;

  if (typeof(window) != 'undefined') {
    var parts = url.parse(window.location.toString(), true);
    if (parts.query.controller) {
      newController = parts.query.controller.replace(/[^a-z\-]/g, '');
    }

    if (parts.query.id) {
      newId = parseInt(parts.query.id);
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
    //var defaultState = {};
    //if (typeof(window) === 'undefined') {
    //} else {
    //  if (history.state) {
    //    defaultState = history.state;
    //  }
    //}

    var defaultState = getControllerFromHash();

    //if (!defaultState.mainView) {
    //  defaultState.mainView = defaultMainView;
    //}

    defaultState.roomLinks = [];

    //if (typeof(history) === 'undefined') {
    //} else {
    //  history.pushState(defaultState, "", null);
    //}

    //defaultState.controller = defaultController.controller;

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
    console.log("popstate", this.state, ev, history.state);
    var foo = getControllerFromHash();
    console.log(foo);
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

    return (
      <div className={this.state.loggedIn ? 'authenticated' : 'restricted'}>
        <div className="primary-anchors">
          <a href="?">#</a>
          <Anchor href="?controller=list-rooms">LIST ROOMS</Anchor>
          <Anchor href="?controller=join-room">JOIN ROOM</Anchor>
          {this.state.roomLinks}
        </div>
        {this.state.connectionComponent}
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
