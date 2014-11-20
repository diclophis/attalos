var React = require('react');

var ListRooms = React.createClass({
  getInitialState: function() {
    return {
      roomMenuItems: [
       { payload: '#1', text: 'ROOM 1' },
       { payload: '#2', text: 'ROOM 2' },
       { payload: '#3', text: 'ROOM 3' },
       { payload: '#4', text: 'ROOM 4' }
      ]
    };
  },

  render: function() {
    var roomButtons = [];
    for (var i=0; i<this.state.roomMenuItems.length; i++) {
      var roomButtonData = this.state.roomMenuItems[i];
      roomButtons.push(<li key={i}><a href={roomButtonData.payload}>{roomButtonData.text}</a></li>);
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
