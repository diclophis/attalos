var React = require('react');
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
  toggleLeftNav: function() {
    //this.refs.leftNav.toggle();
  },
  render: function() {
    var mainViewComponent = null;

    switch (this.state.mainView) {
      case '#create-room':
        mainViewComponent = <CreateRoom />;
        break;

      case '#list-rooms':
      default:
        mainViewComponent = <ListRooms />;
    }

    return (
      <div>
        <a onClick={this.toggleLeftNav} href="">#</a>
        <a href="#list-rooms">LIST ROOMS</a>
        <a href="#create-room">CREATE ROOM</a>
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
