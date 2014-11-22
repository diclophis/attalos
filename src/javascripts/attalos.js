// primary entry point

var React = require('react');
var Connect = require('./connect');
var CreateRoom = require('./create-room');
var ListRooms = require('./list-rooms');
var vent = require('./vent').vent;
var url = require('url');
var listenTo = require('react-listento');

var getControllerFromHash = function() {
  var newController = null;

  if (typeof(window) != 'undefined') {
    if (window.location.hash) {
      newController = window.location.hash.replace(/[^a-z\-]/g, '');
      //console.log(newController, window.location.hash);
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

    return defaultState;
  },

  componentDidMount: function() {
    this.listenTo(vent, 'login', this.onLoggedInOrOut);
    this.listenTo(vent, 'logout', this.onLoggedInOrOut);
    this.listenTo(window, 'onpopstate', this.onPopState);
    this.listenTo(window, 'hashchange', this.onControllerChanged);
  },

  onControllerChanged: function() {
    //console.log(getControllerFromHash());
    this.setState({mainView: getControllerFromHash()});
  },

  onPopState: function() {
    //var currentMainView = this.state.mainView;
    //var newMainView = null
    //if (newMainView) {
    //this.setState({mainView: this.getControllerFromHash());
    console.log("popstate", this.state, history.state);
  },

  onLoggedInOrOut: function(loggedIn) {
    //console.log("login", loggedIn, this.state);
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

    if (this.state.loggedIn) {
    } else {
      mainViewComponent = <Connect />;
    }

    return (
      <div className={this.state.loggedIn ? 'authenticated' : 'restricted'}>
        <div>
          <a className="vip" href="#">#</a>
          <a href="#list-rooms">LIST ROOMS</a>
          <a href="#create-room">CREATE ROOM</a>
          {this.state.roomLinks}
        </div>
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
