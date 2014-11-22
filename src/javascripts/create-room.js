var React = require('react');
var xmpp = require('stanza.io');
var url = require('url');

var CreateRoom = React.createClass({
  getInitialState: function() {
    return {
      room: ''
    };
  },

  handleRoomValidation: function(event) {
    this.setState({room: event.target.value.substr(0, 32)});
  },

  onCreatedRoom: function(ev) {
    ev.preventDefault();
    room = this.getDOMNode();
    form = url.parse(room.action, true);
    //console.log(room.action, form, form.queryString);
    window.location.hash = form.hash;
    history.pushState(this.state, "", null);
  },

  render: function() {
    return (
      <form action="#room" onSubmit={this.onCreatedRoom}>
        <input name="room" type="text" placeholder="name of room/discussion" value={this.state.room} onChange={this.handleRoomValidation}></input>
        <button>CREATE ROOM</button>
      </form>
    );
  }
});

module.exports = CreateRoom;
