var React = require('react'),
  mui = require('material-ui'),
  LeftNav = mui.LeftNav,
  MenuItem = mui.MenuItem,
  Paper = mui.Paper,
  PaperButton = mui.PaperButton;

var menuItems = [
  { route: 'login', text: 'Login' },
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
      <Paper ref="mainPaper" rounded={false}>
        <LeftNav ref="leftNav" docked={false} menuItems={menuItems} />
        <Paper rounded={false}>
          <PaperButton onClick={this.toggleLeftNav} type={PaperButton.Types.FLAT} label="INDEX" />
        </Paper>
      </Paper>
    );
  }
});


module.exports = AttalosComponent;
