// primary entry point

var React = require('react');
var listenTo = require('react-listento');

var Connections = require('./connections');
var JoinRoom = require('./join-room');
var ListRooms = require('./list-rooms');
var Room = require('./room');
var centralDispatch = require('./central-dispatch').singleton;

var stateTree = require('./state-tree');

var PeerConnection = null;
var IceCandidate = null;
var SessionDescription = null;

//TODO: move this into a module???
// upgrade RTC modules into real objects
if (typeof(window) === 'object' && typeof(navigator) == 'object') {
  PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
  SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
  navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
}


var AttalosComponent = React.createClass({
  mixins: [listenTo, stateTree.mixin],
  cursors: {
    connections: ['defaults', 'connections']
  },

  getInitialState: function() {
    var defaultState = centralDispatch.getControllerFromHash();

    defaultState.roomLinks = [];
    defaultState.messages = {};

    defaultState.pc1 = null;
    defaultState.pc2 = null;
    defaultState.offer = null;
    defaultState.answer = null;
    defaultState.streamSources = [];

    defaultState.connectionAttempts = 0;

    return defaultState;
  },

  componentDidMount: function() {
    if (centralDispatch.client) {
      var cursor = this.cursors.connections.select(0);
      if (cursor && cursor.get('loggedIn')) {
        if (this.state.connectionAttempts > 0) {
          console.log("FOOOOO");
          centralDispatch.client.disconnect();
        }
        cursor.set('loggedIn', false);
      }
    }

    var cursor = this.cursors.connections.select(0);
    var isLoggedIn = cursor.get('loggedIn');
    if (this.state.id && !isLoggedIn) {
      this.state[this.state.id+'.joined'] = false;
    }

    centralDispatch.addLoginLogoutHandler(this, this.onLoggedInOrOut);
    centralDispatch.addPopStateHandler(this, this.onPopState);

    this.listenTo(centralDispatch, 'recv', this.didReceiveMessage);
  },

  didReceiveMessage: function(msg, _) {

    var newState = {};

    if (msg.from && msg.body) {

      if (msg.from.resource.indexOf("rtc") != -1) {

        parsedMsg = JSON.parse(msg.body);
  
        if ("offer" === parsedMsg.type) {

          if (this.state.pc1) {

            //NOTE: this is an unknown state

          } else {

            var pc1 = this.makePc();
            var offer = new SessionDescription(parsedMsg.body);

            pc1.setRemoteDescription(offer, this.onRemoteDescriptionSet, this.onRtcError);
            pc1.createAnswer(this.onAnswerCreated, this.onRtcError, {mandatory:{OfferToReceiveAudio:true, OfferToReceiveVideo:true}});

            newState.pc1 = pc1;
            newState.offerRecv = offer;

          }
        } else if ("answer" == parsedMsg.type) {

          if (this.state.offerRecv) {

            //NOTE: this is an unknown state

          } else {

            var answer = new SessionDescription(parsedMsg.body);
            this.state.pc1.setRemoteDescription(answer, this.onRemoteDescriptionSet, this.onRtcError);

          }

        } else if ("icecandidate" === parsedMsg.type) {

          if ((this.state.id + "/" + centralDispatch.client.jid.local + "?rtc") != msg.from.full) {

            this.state.pc1.addIceCandidate(new IceCandidate(parsedMsg.body));

          } else {

            //NOTE: this is an unknown state

          }

        } else {

          //NOTE: this is an unknown state

        }

      } else {

        var a = (this.state[msg.from.bare] || []);
        msg.body = "`" + msg.from.resource + String.fromCharCode(160) + String.fromCharCode(160) + "` " + msg.body;
        a.unshift(msg.body);
        newState[msg.from.bare] = a

      }
    } else {

      if (msg.from.resource != centralDispatch.client.jid.local) {

      } else {

        newState[msg.from.bare+'.joined'] = true;

      }
    }

    this.setState(newState);
  },

  makePc: function() {
    var options = {
      iceServers: [
        {url: "stun:stun1.l.google.com:19302"},
        {url: "stun:stun2.l.google.com:19302"},
        {url: "stun:stun3.l.google.com:19302"},
        {url: "stun:stun4.l.google.com:19302"}
      ]
    };

    pc = new PeerConnection(options);

    this.listenTo(pc, 'icecandidate', this.onIceCandidate);
    this.listenTo(pc, 'addstream', this.onAddStream);

    return pc;
  },

  onPopState: function(ev) {
    var foo = centralDispatch.getControllerFromHash();
    this.setState(foo);
  },

  onLoggedInOrOut: function(loggedIn) {
    var attempts = this.state.connectionAttempts;
    if (loggedIn) {
      attempts += 1;
    }
    this.setState({ loggedIn: loggedIn, connectionAttempts: attempts });
  },

  onAnswerCreated: function(description) {
    this.state.pc1.setLocalDescription(description, this.onLocalDescriptionSet, this.onRtcError);
    this.sendSignal("answer", description);
  },

  onRemoteDescriptionSet: function() {
  },

  onLocalDescriptionSet: function() {
  },

  onCreateStream: function(stream) {
    if (!this.state.pc1) {

      var pc1 = this.makePc();
      this.setState({pc1: pc1});

      pc1.addStream(stream);

      pc1.createOffer(this.onOfferCreated, this.onRtcError, {mandatory:{"offerToReceiveAudio":true,"offerToReceiveVideo":true}});
      
      this.addStream(stream);

    } else {

      this.state.pc1.addStream(stream);
      this.addStream(stream);

    }
  },

  addStream: function(stream) {
    var src = URL.createObjectURL(stream);
    var a = (this.state.streamSources);
    a.unshift(src);
    this.setState({ streamSources: a });
  },

  onIceCandidate: function (e) {
    // candidate exists in e.candidate
    if (e.candidate == null) { return }

    this.sendSignal("icecandidate", e.candidate);
  },

  onAddStream: function(ev, retries) {
    if ("undefined" === typeof(retries)) {
      retries = 1;
    }

    if (ev.target.iceConnectionState === "connected") { 
      this.addStream(ev.stream);
    } else {
      if (retries < 10) {
        setTimeout(this.onAddStream, 100, ev, (retries + 1));
      } else {
        console.log("lost stream");
      }
    }
  },

  componentDidUpdate: function() {
    var cursor = this.cursors.connections.select(0);
    var isLoggedIn = cursor.get('loggedIn');
    if (this.state.id && !isLoggedIn) {
      this.state[this.state.id+'.joined'] = false;
    }

    if (this.state.controller == "room") {
      if (isLoggedIn && (this.state.id && this.state.id.length > 0) && !this.state[this.state.id+'.joined']) {
        centralDispatch.joinRoom(this.state.id);
      }
    }
  },

  onRtcError: function(err) {
    console.error("ERROR", err, err.message);
  },

  onOfferCreated: function(description) {

    this.state.pc1.setLocalDescription(description, this.onLocalDescriptionSet, this.onRtcError);
    this.sendSignal("offer", description);

  },

  sendSignal: function(type, body) {

    var to = this.state.id + "/" + centralDispatch.client.jid.local + "?rtc";

    centralDispatch.send({
      to: to,
      body: JSON.stringify({ type: type, body: body }),
      type: 'groupchat'
    });

  },

  addVideo: function(ev) {
    var mediaOptions = { video: true, audio: true };
    navigator.getUserMedia(mediaOptions, this.onCreateStream, this.onRtcError);
  },

  render: function() {
    return (
      <div>
        <a href="?">#</a>
        <Connections boshHost={this.props.boshHost} boshPort={this.props.boshPort}/>
        <button onClick={this.addVideo}>video</button>
        <JoinRoom key="join-room" id={this.state.id}/>
        <ListRooms key="list-rooms" />
        <Room key="room" id={this.state.id} nick={this.state.nick} streams={this.state.streamSources} messages={this.state[this.state.id] || []} joined={this.state[this.state.id+'.joined']}/>
      </div>
    );
  }
});


module.exports = AttalosComponent;
