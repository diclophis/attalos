var React = require('react');
var createReactClass = require('create-react-class');
var marked = require('marked');

var centralDispatch = require('./central-dispatch').singleton;
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


var lastMessageCount = 0;


var Room = createReactClass({
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
    var node = this.refs.focusTarget;
    node.focus();
  },

  componentWillUpdate: function() {
    var node = this.refs.allm;
    //var node2 = this.refs.videos.getDOMNode();
    ////console.log(window.innerHeight, window.scrollY, node.offsetHeight, getPosition(node), node2.scrollHeight);
    ////569 1008 1412 Object {x: 8, y: -843} 264

    if (this.state.messages.length != lastMessageCount) {
      lastMessageCount = this.state.messages.length;
      this.shouldScrollBottom = true; //(node.offsetHeight + getPosition(node).y) == window.innerHeight;
    } else {
      this.shouldScrollBottom = false; //(node.offsetHeight + getPosition(node).y) == window.innerHeight;
    }
  },
   
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.refs.focusRule;
      node.scrollIntoView(false);
    }
    //////node.scrollIntoView(false);

    if (this.state.shouldFocusNow) {
      node = this.refs.focusTarget;
      node.focus();
    }
  },

  haltEvent: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  dropEvent: function(event) {
    this.haltEvent(event);

    var dataTransfer = event.dataTransfer;

    for (var i = 0; i < dataTransfer.files.length; i++) {
      var fileIn = dataTransfer.files[i];
      var fileNameIn = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
      var uploadUrlIn =  "https://webdav.bardin.haus/incoming/" + fileNameIn;
      var fileTypeIn = fileIn.type;

      (function(tharse, file, uploadUrl, fileName, fileType) {
        var xhr    = new XMLHttpRequest();
        var fileUpload = xhr.upload;

        fileUpload.addEventListener("progress", function(event) {
          if (event.lengthComputable) {
            var percentage = Math.round((event.loaded * 100) / event.total);
            if (percentage < 100) {
              console.log("percent complete", percentage);
            }
          }
        }, false);

        fileUpload.addEventListener("load", function(event) {
          console.log("upload: finished");
          if (fileType.indexOf("image") === 0) {
            var imgMarkdown = String.fromCharCode(13) + '![alt](' + uploadUrl + ' "alt")';
            this.setState({
              message: this.state.message + imgMarkdown
            });
          }
        }.bind(tharse), false);

        fileUpload.addEventListener("error", function(event) {
          console.log("error", event);
        }, false);

        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('X-Filename', fileName);
        xhr.setRequestHeader('Authorization', 'Basic Z3Vlc3Q6Z3Vlc3Q=');
        xhr.send(file);
      })(this, fileIn, uploadUrlIn, fileNameIn, fileTypeIn);
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

    /*
    */

    return (
      <form onSubmit={this.willSend}>
        <div ref="allm" className="room">
          <div ref="videos">
            <div>
              <video ref="localVideo" autoPlay src={localVideoSrc}></video>
            </div>
            <div ref="remoteVideos">
            </div>
          </div>
          <div className="room-messages">
            <ul>
              {messages}
            </ul>
          </div>
          <div 
            onDragEnter={this.haltEvent}
            onDragOver={this.haltEvent}
            onDrop={this.dropEvent}
            ref="messages" className="room-input">
            <textarea 
              disabled={!this.state.meJoinedRoom} ref="focusTarget" value={this.state.message} onKeyDown={this.handleShiftKeyToggle} onChange={this.handleMessageValidation}></textarea>
          </div>
          <div ref="scrollRule"></div>
          <div ref="focusRule"></div>
        </div>
      </form>
    );
  }
});


module.exports = Room;
