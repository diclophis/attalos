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
      this.setState({ messages: [msg.body].concat(this.state.messages)});
    }
  },

  componentDidMount: function() {
    this.listenTo(vent, 'recv', this.didReceiveMessage);
  },

  componentWillUpdate: function() {
    var node = this.refs.allm.getDOMNode();
    //this.shouldScrollBottom = (window.scrollBottom + node.clientHeight === node.scrollHeight);
    //sb = parseInt(document.clientHeight) - parseInt(window.scrollTop) - parseInt(window.clientHeight); 
    //console.log(sb, (document.scrollHeight), (window.scrollTop),  (window.clientHeight));
    //console.log((window.innerHeight + window.scrollY), document.body.offsetHeight, window.scrollY, window.innerHeight, node.offsetHeight, node.style.height);
    //(window.innerHeight + window.scrollY) >= node.offsetHeight;
    //var node = this.refs.messages.getDOMNode();
    //node.scrollTop = (parseInt(node.scrollHeight) + 1000) + 'px';
    //document.body.scrollTop = window.height;

    this.shouldScrollBottom = (window.innerHeight + window.scrollY) >= node.offsetHeight;
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.messages.getDOMNode();
      node.focus();
      node.scrollIntoView(false);
    }
  },

  render: function() {
    var messages = [];

    var slicedMessages = this.state.messages.slice(0, 32);

    for (var i=0; i<slicedMessages.length; i++) {
      var message = marked(slicedMessages[i]);
      messages.unshift(
        <li key={i + '-message'} dangerouslySetInnerHTML={{__html: message}}></li>
      );
    }

    return (
      <form onSubmit={this.willSend}>
        <div ref="allm" className="room">
          <div className="room-messages">
            <ul>
              {messages}
            </ul>
          </div>
          <div ref="messages" className="room-input">
            <textarea defaultValue={this.state.message} value={this.state.message} onKeyDown={this.handleShiftKeyToggle} onChange={this.handleMessageValidation}></textarea>
            <button>SEND</button>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = Room;
