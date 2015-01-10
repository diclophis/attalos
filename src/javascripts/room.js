var React = require('react');
var centralDispatch = require('./central-dispatch').singleton;
var marked = require('marked');
var Rtc = require('./rtc');

var Room = React.createClass({
  getInitialState: function() {
    marked.setOptions({ gfm: true, breaks: true });

    return {
      meJoinedRoom: false,
      messages: [],
      message: ''
    };
  },

  willSend: function(ev) {
    ev.preventDefault();
    this.sendMessage();
  },

  sendMessage: function() {
    //replace(/^\s+|\s+$/g, '')
    if (this.state.message.length > 0) {
      centralDispatch.send({
        to: this.props.id,
        body: this.state.message,
        type: 'groupchat'
      });
    }
    
    this.setState({ message: '' });
  },

  handleShiftKeyToggle: function(ev) {
    var shouldSendNow = (false === ev.shiftKey && 13 === ev.keyCode);
    this.setState({shouldSendNow: shouldSendNow});
  },

  handleMessageValidation: function(ev) {
    this.setState({message: ev.target.value.substr(0, 4096)});

    if (this.state.shouldSendNow) {
      this.sendMessage();
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({messages: nextProps.messages, meJoinedRoom: nextProps.joined});
  },

  componentWillMount: function() {
    this.setState({messages: this.props.messages});
  },

  componentDidMount: function() {
    var node = this.refs.focusTarget.getDOMNode();
    node.focus();
  },

  componentWillUpdate: function() {
    var node = this.refs.allm.getDOMNode();

    this.shouldScrollBottom = (window.innerHeight + window.scrollY) >= node.offsetHeight;
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.messages.getDOMNode();
      node.scrollIntoView(false);
      node = this.refs.focusTarget.getDOMNode();
      node.focus();
    }
  },

  render: function() {
    var messages = [];

    var slicedMessages = this.state.messages.slice(0, 32);

    for (var i=0; i<slicedMessages.length; i++) {
      //NOTE: we allow the markdown formatted html to render un-escaped
      var message = marked(slicedMessages[i]);
      messages.unshift(
        <li key={i + '-message'} dangerouslySetInnerHTML={{__html: message}}></li>
      );
    }

    return (
      <form onSubmit={this.willSend}>
        <div ref="allm" className="room">
          <div className="room-messages">
            <div>
              <Rtc id={this.props.id} />
            </div>
            <ul>
              {messages}
            </ul>
          </div>
          <div ref="messages" className="room-input">
            <textarea disabled={!this.state.meJoinedRoom} ref="focusTarget" defaultValue={this.state.message} value={this.state.message} onKeyDown={this.handleShiftKeyToggle} onChange={this.handleMessageValidation}></textarea>
            <button disabled={this.state.message.length == 0}>SEND</button>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Room;
