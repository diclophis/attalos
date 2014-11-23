var React = require('react');
var xmpp = require('stanza.io');
var url = require('url');
var querystring = require('querystring');
var vent = require('./vent').vent;

var CreateRoom = React.createClass({
  getInitialState: function() {
    return {
      controller: 'room',
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
    var newQueryString = querystring.stringify(this.state);

    var newControllerUrl = window.location.pathname + '?' + newQueryString;
    history.pushState({}, "", newControllerUrl);
    vent.emit('popstate', {});
  },

  render: function() {
    return (
      <form action="#room" onSubmit={this.onCreatedRoom}>
        <input name="room" type="text" placeholder="name of room/discussion" value={this.state.room} onChange={this.handleRoomValidation}></input>
        <button disabled={this.state.room.length == 0}>CREATE ROOM</button>
      </form>
    );
  }
});

module.exports = CreateRoom;
