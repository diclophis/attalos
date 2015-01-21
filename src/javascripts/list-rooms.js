var React = require('react');
var Anchor = require('./anchor');
var centralDispatch = require('./central-dispatch').singleton;

var ListRooms = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var roomButtons = [];

    //for (var i=0; i<centralDispatch.client.roomMenuItems.length; i++) {
    //  var roomButtonData = this.state.roomMenuItems[i];
    //  roomButtons.push(<li key={i}><Anchor href={roomButtonData.payload}>{roomButtonData.text}</Anchor></li>);
    //}

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
