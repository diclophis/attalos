var React = require('react'),
  mui = require('material-ui'),
  LeftNav = mui.LeftNav,
  MenuItem = mui.MenuItem,
  Paper = mui.Paper,
  PaperButton = mui.PaperButton,
  AttalosCreateRoom = require('./attalos-create-room');

var menuItems = [
  { route: '#attalos-create-room', text: 'CREATE ROOM' },
  { type: MenuItem.Types.SUBHEADER, text: 'Help' },
  { 
     type: MenuItem.Types.LINK, 
     payload: 'https://github.com/diclophis/attalos', 
     text: 'GitHub' 
  },
];

var AttalosComponent = React.createClass({
  toggleLeftNav: function() {
    this.refs.leftNav.toggle();
  },
  render: function() {
    return (
      <Paper rounded={false} className="c5">
        <PaperButton onClick={this.toggleLeftNav} type={PaperButton.Types.FLAT} label="INDEX" />
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems} />
        <AttalosCreateRoom />
      </Paper>
    );
  }
});

module.exports = AttalosComponent;
