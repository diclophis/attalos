var React = require('react');
var url = require('url');
var querystring = require('querystring');
var centralDispatch = require('./central-dispatch').singleton;
var slug = require('./slug');

var JoinRoom = React.createClass({
  getInitialState: function() {
    return {
      controller: 'room',
      id: ''
    };
  },

  handleRoomValidation: function(ev) {
    this.setState({ id: slug(ev.target.value, 32) });
  },

  willJoinRoom: function(ev) {
    ev.preventDefault();

    var newQueryString = querystring.stringify(this.state);
    var newControllerUrl = window.location.pathname + '?' + newQueryString;

    centralDispatch.navigateTo(newControllerUrl);
  },

  componentDidMount: function() {
    var node = this.refs.focusTarget.getDOMNode();
    node.focus();
  },

  render: function() {
    return (
      <form onSubmit={this.willJoinRoom}>
        <ul>
          <li>
            name:
            <input ref="focusTarget" placeholder="name of discussion" value={this.state.id} onChange={this.handleRoomValidation}></input>
            <button disabled={this.state.id.length == 0}>JOIN ROOM</button>
          </li>
        </ul>
      </form>
    );
  }
});

module.exports = JoinRoom;
