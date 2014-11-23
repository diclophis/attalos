var React = require('react');
var Anchor = require('./anchor');

var ListRooms = React.createClass({
  getInitialState: function() {
    return {
      roomMenuItems: [
       { payload: '?controller=room&id=1', text: 'ROOM 1' },
       { payload: '?controller=room&id=2', text: 'ROOM 2' }
      ]
    };
  },

  render: function() {
    var roomButtons = [];
    for (var i=0; i<this.state.roomMenuItems.length; i++) {
      var roomButtonData = this.state.roomMenuItems[i];
      roomButtons.push(<li key={i}><Anchor href={roomButtonData.payload}>{roomButtonData.text}</Anchor></li>);
    }

    return (
      <form>
        <ul>
          {roomButtons}
        </ul>
      </form>
    );
  }
});

module.exports = ListRooms;
