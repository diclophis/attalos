var React = require('react');

var mui = require('material-ui'),
      LeftNav = mui.LeftNav,
      MenuItem = mui.MenuItem,
      Paper = mui.Paper,
      PaperButton = mui.PaperButton;

var CreateRoom = require('./create-room');
var ListRooms = require('./list-rooms');

var url = require('url');

var AttalosComponent = React.createClass({
  getInitialState: function() {
    // Parse the URL of the current location
    //var parts = url.parse(window.location.toString());
    // Log the parts object to our browser's console
    //console.log(parts);

    return {
      menuItems: [
        { type: MenuItem.Types.LINK, payload: '#list-rooms', text: 'LIST ROOMS' },
        { type: MenuItem.Types.LINK, payload: '#create-room', text: 'CREATE ROOM' },
        { type: MenuItem.Types.SUBHEADER, text: 'Help' },
        { 
           type: MenuItem.Types.LINK, 
           payload: 'https://github.com/diclophis/attalos', 
           text: 'GitHub' 
        },
      ],
      mainView: window.location.hash
    };
  },
  componentDidMount: function() {
    var attalosWindowBridge = this;
    window.onhashchange = function () {
      attalosWindowBridge.setState({ mainView: window.location.hash });
    };
  },
  toggleLeftNav: function() {
    this.refs.leftNav.toggle();
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
        <PaperButton onClick={this.toggleLeftNav} type={PaperButton.Types.FLAT} label="=" />
        <PaperButton href="#list-rooms" type="FLAT" label="LIST ROOMS" />
        <PaperButton href="#create-room" type="FLAT" label="CREATE ROOM" />
        <LeftNav ref="leftNav" docked={false} menuItems={this.state.menuItems} />
        {mainViewComponent}
      </div>
    );
  }
});

module.exports = AttalosComponent;
