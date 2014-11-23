var React = require('react');
var vent = require('./vent').vent;

var Room = React.createClass({
  getInitialState: function() {
    return {
      message: ''
    };
  },

  willSend: function(ev) {
    ev.preventDefault();
    console.log('send');
    this.setState({ message: '' });
  },

  handleMessageValidation: function(event) {
    this.setState({message: event.target.value.substr(0, 4096)});
  },

  render: function() {
    return (
      <form onSubmit={this.willSend}>
        <div className="room-messages">
          <ul>
            <li>{this.props.id}</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>123</li>
            <li>last</li>
          </ul>
        </div>
        <div className="room-input">
          <textarea defaultValue={this.state.message} value={this.state.message} onChange={this.handleMessageValidation}></textarea>
          <button>SEND</button>
        </div>
      </form>
    );
  }
});

module.exports = Room;
