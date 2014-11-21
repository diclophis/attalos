// primary entry point

var React = require('react');
var Connect = require('./connect');
var CreateRoom = require('./create-room');
var ListRooms = require('./list-rooms');
var url = require('url');

var AttalosComponent = React.createClass({
  getInitialState: function() {
    // Parse the URL of the current location
    //var parts = url.parse(window.location.toString());
    // Log the parts object to our browser's console
    //console.log(parts);
    var defaultMainView = null;
    if (typeof(window) === 'undefined') {
    } else {
      defaultMainView = window.location.hash
    }

    return {
      mainView: defaultMainView
    };
  },
  componentDidMount: function() {
    var attalosWindowBridge = this;
    window.onhashchange = function () {
      attalosWindowBridge.setState({ mainView: window.location.hash });
    };
  },
  render: function() {
    var mainViewComponent = null;

    switch (this.state.mainView) {
      case '#create-room':
        mainViewComponent = <CreateRoom />;
        break;

      case '#list-rooms':
        mainViewComponent = <ListRooms />;
        break;

      default:
        mainViewComponent = <Connect />;
    }

    return (
      <div className={this.props.bootstrapped ? 'bootstrapped' : 'static'}>
        <a href="">#</a>
        <a href="#list-rooms">LIST ROOMS</a>
        <a href="#create-room">CREATE ROOM</a>
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
