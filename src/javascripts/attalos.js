// primary entry point

var React = require('react');
var Anchor = require('./anchor');
var Connect = require('./connect');
var JoinRoom = require('./join-room');
var ListRooms = require('./list-rooms');
var Room = require('./room');
var centralDispatch = require('./central-dispatch').singleton;
var listenTo = require('react-listento');

var PeerConnection = null;
var IceCandidate = null;
var SessionDescription = null;

// upgrade RTC modules into real objects
if (typeof(window) === 'object' && typeof(navigator) == 'object') {
  PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
  SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
  navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
}

var AttalosComponent = React.createClass({
  mixins: [listenTo],

  getInitialState: function() {
    var defaultState = centralDispatch.getControllerFromHash();

    defaultState.roomLinks = [];
    defaultState.messages = {};


    defaultState.pc1 = null;
    defaultState.pc2 = null;
    defaultState.offer = null;
    defaultState.answer = null;
    defaultState.streamSources = [];

    return defaultState;
  },

  componentDidMount: function() {
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

            //console.log("DEAD ECHO ???");

          } else {

            console.log("setting my remoteDescript to rtc offer", parsedMsg, msg.from.full);

            var pc1 = this.makePc();
            var offer = new SessionDescription(parsedMsg.body);

            pc1.setRemoteDescription(offer, this.onRemoteDescriptionSet, this.onRtcError);
            pc1.createAnswer(this.onAnswerCreated, this.onRtcError, {mandatory:{OfferToReceiveAudio:true, OfferToReceiveVideo:true}});

            newState.pc1 = pc1;
            newState.offerRecv = offer;

          }
        } else if ("answer" == parsedMsg.type) {

          if (this.state.offerRecv) {

            //console.log("dead end echo 2");

          } else {

            var answer = new SessionDescription(parsedMsg.body);
            this.state.pc1.setRemoteDescription(answer, this.onRemoteDescriptionSet, this.onRtcError);
          }

        } else if ("icecandidate" === parsedMsg.type) {

          if ((this.state.id + "/" + centralDispatch.client.jid.local + "?rtc") != msg.from.full) {

            this.state.pc1.addIceCandidate(new IceCandidate(parsedMsg.body));

          } else {
            //console.log("????", msg.from.full, parsedMsg);
          }
        } else {
          //console.log("???", msg.from.full, parsedMsg);
        }
      } else {

        var a = (this.state[msg.from.bare] || []);
        a.unshift(msg.body);
        newState[msg.from.bare] = a;

      }
    } else {
      if (msg.from.resource != centralDispatch.client.jid.local) {

        console.log("got presence of other user, but currently offering to original, halt");

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
        /*
        stun.l.google.com:19302
        stun1.l.google.com:19302
        stun2.l.google.com:19302
        stun3.l.google.com:19302
        stun4.l.google.com:19302
        stun01.sipphone.com
        stun.ekiga.net
        stun.fwdnet.net
        stun.ideasip.com
        stun.iptel.org
        stun.rixtelecom.se
        stun.schlund.de
        stunserver.org
        stun.softjoys.com
        stun.voiparound.com
        stun.voipbuster.com
        stun.voipstunt.com
        stun.voxgratia.org
        stun.xten.com
        */
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
    this.setState({ loggedIn: loggedIn });
  },

  onAnswerCreated: function(description) {
    this.state.pc1.setLocalDescription(description, this.onLocalDescriptionSet, this.onRtcError);
    this.sendSignal("answer", description);
  },

  onRemoteDescriptionSet: function() {
    //console.log('OnRemoteDescriptSet Yay, we finished signaling offers and answers');
    //console.log(this.state.pc1.signalingState);
  },

  onLocalDescriptionSet: function() {
    //console.log("onLocalDescriptionSet... where are ICE?");
    //console.log(this.state.pc1.signalingState);
    // if i recvd offer
    // set remoteDescript to recvdOffer
    //if (this.state.offerRecv) {
    //  //this.state.pc1.setRemoteDescription(this.state.offerRecv, this.onRemoteDescriptionSet, this.onRtcError);
    //}
    //  // after this function returns, pc1 will start firing icecandidate events
    //  this.state.pc2.setRemoteDescription(this.state.offer, this.onPc2RemoteDescriptionSet, this.onRtcError);
  },

  onCreateStream: function(stream) {
    if (!this.state.pc1) {
      console.log("got presence without pc, sending offer");
      //rtc

      var pc1 = this.makePc();
      this.setState({pc1: pc1});

      pc1.addStream(stream);

      //pc1.createOffer(this.onOfferCreated, this.onRtcError, {mandatory:{OfferToReceiveAudio:true, OfferToReceiveVideo:true}});
      pc1.createOffer(this.onOfferCreated, this.onRtcError, {mandatory:{"offerToReceiveAudio":true,"offerToReceiveVideo":true}});
      
      //var mediaOptions = { video: true, audio: true };
      //getUserMedia(mediaOptions, this.onCreateStream, this.onRtcError);

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
    //console.log("otherStream", ev);

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

    //<video id="otherPeer" autoplay></video>
    //var otherPeer = document.getElementById("otherPeer");
    //otherPeer.src = URL.createObjectURL(e.stream);
  },

  componentDidUpdate: function() {
    if (this.state.controller == "room") {
      if (!this.state[this.state.id+'.joined']) {
        centralDispatch.joinRoom(this.state.id);
      }
    }
  },

  onRtcError: function(err) {
    console.error("ERROR", err, err.message);
  },

  onOfferCreated: function(description) {
    //console.log("onOfferCreate, setting my localDescript to result, sending it as offer");

    this.state.pc1.setLocalDescription(description, this.onLocalDescriptionSet, this.onRtcError);
    this.sendSignal("offer", description);

  },

  sendSignal: function(type, body) {

    var to = this.state.id + "/" + centralDispatch.client.jid.local + "?rtc";
    //console.log("send", to, type, body);
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
    var mainViewComponent = null;

    switch (this.state.controller) {
      case 'join-room':
        mainViewComponent = <JoinRoom key="join-room" />;
        break;

      case 'list-rooms':
        mainViewComponent = <ListRooms key="list-rooms" />;
        break;

      case 'room':
        mainViewComponent = <Room key="room" id={this.state.id} nick={this.state.nick} streams={this.state.streamSources} messages={this.state[this.state.id] || []} joined={this.state[this.state.id+'.joined']}/>;
        break;

      default:
    }

    var extraAnchor = null;

    if (this.state.id && this.state.controller == 'room') {
      extraAnchor = <Anchor href={"?controller=room&id=" + this.state.id}><h2>{this.state.id}</h2></Anchor>;
    }

    var bootstrappedComponents = [];

    if (this.props.bootstrapped) {
      if (!this.state.loggedIn) {
        bootstrappedComponents.push(<Connect key="connect" />);
      }

      bootstrappedComponents.push(mainViewComponent);
    }

    return (
      <div className={this.state.loggedIn ? 'authenticated' : 'restricted'}>
        <div className="primary-anchors">
          <a href="?">#</a>
          <ul>
            <li>
              <Anchor href="?controller=list-rooms" className="list-rooms">LIST-ROOMS</Anchor>
            </li>
            <li>
              <Anchor href="?controller=join-room">JOIN-ROOM</Anchor>
            </li>
            <li>
              <button onClick={this.addVideo}>video</button>
            </li>
          </ul>
          {extraAnchor}
        </div>
        {bootstrappedComponents}
      </div>
    );
  }
});

module.exports = AttalosComponent;
