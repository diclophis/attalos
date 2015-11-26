var React = require('react');
var centralDispatch = require('./central-dispatch').singleton;
var marked = require('marked');
var stateTree = require('./state-tree');

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
 
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

var Room = React.createClass({
  mixins: [stateTree.mixin],
  cursors: {
    connections: ['defaults', 'connections']
  },

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

    var shouldFocusNow = false;

    if (!this.state.meJoinedRoom && nextProps.joined) {
      shouldFocusNow = true;
    }
      
    this.setState({messages: nextProps.messages, meJoinedRoom: nextProps.joined, shouldFocusNow: shouldFocusNow});
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
    var node2 = this.refs.videos.getDOMNode();

    //console.log(window.innerHeight, window.scrollY, node.offsetHeight, getPosition(node), node2.scrollHeight);
    //569 1008 1412 Object {x: 8, y: -843} 264
    this.shouldScrollBottom = (node.offsetHeight + getPosition(node).y) == window.innerHeight;
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.focusRule.getDOMNode();
      node.scrollIntoView(false);
    }

    if (this.state.shouldFocusNow) {
      node = this.refs.focusTarget.getDOMNode();
      //node.scrollIntoView(false);
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


    var localVideoSrc = null;
    if (this.props.streams.length > 0) {
      localVideoSrc = this.props.streams[0];
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
            <textarea disabled={!this.state.meJoinedRoom} ref="focusTarget" defaultValue={this.state.message} value={this.state.message} onKeyDown={this.handleShiftKeyToggle} onChange={this.handleMessageValidation}></textarea>
            <button disabled={this.state.message.length == 0}>SEND</button>
          </div>
          <div ref="scrollRule"></div>
          <div ref="videos">
            <div>
              <video ref="localVideo" autoPlay src={localVideoSrc}></video>
            </div>
            <div ref="remoteVideos">
            </div>
          </div>
          <div ref="focusRule"></div>
        </div>
      </form>
    );
  }
});

module.exports = Room;
