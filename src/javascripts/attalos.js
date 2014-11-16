var React = require('react'),
  mui = require('material-ui'),
  LeftNav = mui.LeftNav,
  MenuItem = mui.MenuItem,
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

  render: function() {
    return (
      <div>
        <LeftNav menuItems={menuItems} />
        <PaperButton type={PaperButton.Types.FLAT} label="Default" />
      </div>
    );
  }

});

module.exports = AttalosComponent;
