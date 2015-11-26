var React = require('react');
var url = require('url');
var querystring = require('querystring');
var centralDispatch = require('./central-dispatch').singleton;
var slug = require('./slug');
var stateTree = require('./state-tree');

var JoinRoom = React.createClass({
  mixins: [stateTree.mixin],
  cursors: {
    connections: ['defaults', 'connections']
  },

  getInitialState: function() {
    return {
      controller: 'room',
      id: this.props.id
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

  componentDidUpdate: function() {
    var node = this.refs.focusTarget.getDOMNode();
    var cursor = this.cursors.connections.select(0);
    if (cursor.get('loggedIn') && (this.state.id == null || (this.state.id && this.state.id.length == 0))) {
      node.focus();
    }
  },

  componentDidMount: function() {
    var node = this.refs.focusTarget.getDOMNode();
    var cursor = this.cursors.connections.select(0);
    if (cursor.get('loggedIn') && (this.state.id == null || (this.state.id && this.state.id.length == 0))) {
      node.focus();
    }
  },

  render: function() {
    //var cursor = stateTree.select('defaults', 'connections').select(0);
    var cursor = this.cursors.connections.select(0);
    //console.log(cursor.get('loggedIn'));

    var disabled = !cursor.get('loggedIn');
    var disabled2 = (this.state.id == null || (this.state.id && this.state.id.length == 0));
    return (
      <form onSubmit={this.willJoinRoom}>
        <ul>
          <li>
            name:
            <input disabled={disabled} ref="focusTarget" placeholder="name of discussion" value={this.state.id} onChange={this.handleRoomValidation}></input>
            <button disabled={disabled2}>JOIN ROOM</button>
          </li>
        </ul>
      </form>
    );
  }
});

module.exports = JoinRoom;
