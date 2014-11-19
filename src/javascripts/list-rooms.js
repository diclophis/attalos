var React = require('react');
var mui = require('material-ui'),
    Menu = mui.Menu,
    PaperButton = mui.PaperButton;

var ListRooms = React.createClass({
  getInitialState: function() {
    return {
      roomMenuItems: [
       { payload: '#1', text: 'ROOM 1', type: 'LINK' },
       { payload: '#1', text: 'ROOM 1', type: 'LINK' },
       { payload: '#1', text: 'ROOM 1', type: 'LINK' },
       { payload: '#1', text: 'ROOM 1', type: 'LINK' }
      ]
    };
  },

  render: function() {
    return (
      <form>
        <Menu menuItems={this.state.roomMenuItems} />
      </form>
    );
  }
});

module.exports = ListRooms;
