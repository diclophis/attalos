var React = require('react');
var vent = require('./vent').vent;
var listenTo = require('react-listento');
var marked = require('marked');

var Room = React.createClass({
  mixins: [listenTo],

  getInitialState: function() {
    marked.setOptions({ gfm: true, breaks: true });

    return {
      messages: [],
      message: ''
    };
  },

  willSend: function(ev) {
    ev.preventDefault();
    this.sendMessage();
  },

  sendMessage: function() {
    vent.emit('send', {
      to: 'foo@localhost', body: this.state.message
    });
    this.setState({ message: '' });
  },

  handleShiftKeyToggle: function(event) {
    var shouldSendNow = (false === event.shiftKey && 13 === event.keyCode);
    this.setState({shouldSendNow: shouldSendNow});
  },

  handleMessageValidation: function(event) {
    this.setState({message: event.target.value.substr(0, 4096)});

    if (this.state.shouldSendNow) {
      this.sendMessage();
    }
  },

  didReceiveMessage: function(msg) {
    //console.log('didRec', msg);

    if (msg.body) {
      //TODO: figure out if this is a memory leak or not
      this.setState({ messages: this.state.messages.concat(msg.body)});
    }
  },

  componentDidMount: function() {
    this.listenTo(vent, 'recv', this.didReceiveMessage);
  },

  componentWillUpdate: function() {
    var node = this.refs.messages.getDOMNode();
    this.shouldScrollBottom = (node.scrollTop + node.clientHeight === node.scrollHeight);
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.messages.getDOMNode();
      node.scrollTop = node.scrollHeight
    }
  },

  render: function() {
    var messages = [];

    for (var i=0; i<this.state.messages.length; i++) {
      var message = marked(this.state.messages[i]);
      messages.push(
        <li key={i + '-message'} dangerouslySetInnerHTML={{__html: message}}></li>
      );
    }

    return (
      <form onSubmit={this.willSend}>
        <div ref="messages" className="room-messages">
          <ul>
            {messages}
          </ul>
        </div>
        <div className="room-input">
          <textarea defaultValue={this.state.message} value={this.state.message} onKeyDown={this.handleShiftKeyToggle} onChange={this.handleMessageValidation}></textarea>
          <button>SEND</button>
        </div>
      </form>
    );
  }
});

module.exports = Room;
