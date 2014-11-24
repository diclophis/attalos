var React = require('react');
var Anchor = require('./anchor');

var ListRooms = React.createClass({
  getInitialState: function() {
    return {
      roomMenuItems: [
       { payload: '?controller=room&id=general@conference.error0.xmpp.slack.com', text: 'GENERAL' }
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
