var React = require('react');
var xmpp = require('stanza.io');
var url = require('url');
var querystring = require('querystring');
var vent = require('./vent').vent;
var slug = require('./slug');

var JoinRoom = React.createClass({
  getInitialState: function() {
    return {
      controller: 'room',
      id: ''
    };
  },

  handleRoomValidation: function(event) {
    this.setState({ id: slug(event.target.value, 32) });
  },

  willJoinRoom: function(ev) {
    ev.preventDefault();
    //room = this.getDOMNode();
    //form = url.parse(room.action, true);
    var newQueryString = querystring.stringify(this.state);

    var newControllerUrl = window.location.pathname + '?' + newQueryString;
    history.pushState({}, "", newControllerUrl);
    vent.emit('popstate', {});
  },

  render: function() {
    return (
      <form onSubmit={this.willJoinRoom}>
        name:
        <input placeholder="name of discussion" value={this.state.id} onChange={this.handleRoomValidation}></input>
        <button disabled={this.state.id.length == 0}>JOIN ROOM</button>
      </form>
    );
  }
});

module.exports = JoinRoom;
