// primary entry point

var React = require('react');
var Anchor = require('./anchor');
var Connect = require('./connect');
var CreateRoom = require('./create-room');
var ListRooms = require('./list-rooms');
var vent = require('./vent').vent;
var url = require('url');
var listenTo = require('react-listento');

//TODO: move to module, or internalize
var getControllerFromHash = function() {
  var newController = null;

  if (typeof(window) != 'undefined') {
    var parts = url.parse(window.location.toString(), true);
    if (parts.query.controller) {
      newController = parts.query.controller.replace(/[^a-z\-]/g, '');
    }
  }

  return newController;
};


var AttalosComponent = React.createClass({
  mixins: [listenTo],

  getInitialState: function() {
    var defaultState = {};
    if (typeof(window) === 'undefined') {
    } else {
      if (history.state) {
        defaultState = history.state;
      }
    }

    var defaultMainView = getControllerFromHash();

    if (!defaultState.mainView) {
      defaultState.mainView = defaultMainView;
    }

    defaultState.roomLinks = [];

    if (typeof(history) === 'undefined') {
    } else {
      history.pushState(defaultState, "", null);
    }

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
    this.setState({mainView: getControllerFromHash()});
  },

  onLoggedInOrOut: function(loggedIn) {
    this.setState({ loggedIn: loggedIn });
  },

  render: function() {
    var mainViewComponent = null;

    switch (this.state.mainView) {
      case 'create-room':
        mainViewComponent = <CreateRoom />;
        break;

      case 'list-rooms':
        mainViewComponent = <ListRooms />;
        break;

      default:
    }

    return (
      <div className={this.state.loggedIn ? 'authenticated' : 'restricted'}>
        <div>
          <a href="?">#</a>
          <Anchor href="?controller=list-rooms">LIST ROOMS</Anchor>
          <Anchor href="?controller=create-room">CREATE ROOM</Anchor>
          {this.state.roomLinks}
        </div>
        {this.state.connectionComponent}
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
