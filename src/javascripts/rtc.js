var React = require('react');
var centralDispatch = require('./central-dispatch').singleton;
var listenTo = require('react-listento');

if (typeof(window) === 'object') {
    var PeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
    var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
}

var Rtc = React.createClass({
  mixins: [listenTo],

  sendSignal: function(type, body) {
    //console.log("send", type, body);

    centralDispatch.send({
      to: this.props.id + "/rtc",
      body: JSON.stringify({ type: type, body: body }),
      type: 'groupchat'
    });
  },

  recvSignal: function(msg) {
    //console.log("rcv", msg);

    //if (msg.from.resource != "rtc") {

    //parsedMsg = JSON.parse(msg.body);

    //console.log("recv", msg, parsedMsg);

    //if (msg.from && (msg.from.bare === this.props.id) && msg.body) {
    //  //TODO: figure out if this is a memory leak or not
    //  this.setState({ messages: [msg.body].concat(this.state.messages)});
    //}

    //offer = new SessionDescription(JSON.parse(offer))
    //pc.setRemoteDescription(offer);

    //pc.createAnswer(function (answer) {
    //    pc.setLocalDescription(answer);
    //send("answer", JSON.stringify(answer));
    //}, errorHandler, constraints);
 
    //}
  },

  getInitialState: function() {


    var RTC_PC_OPTIONS = undefined;
    var CONSTRAINTS = undefined;

    var options = {
      iceServers: [
        //{url: "stun:23.21.150.121"},
        //{url: "turn:numb.viagenie.ca", credential: "webrtcdemo", username: "louis%40mozilla.com"}
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

    pc1 = new PeerConnection(options);
    //pc2 = new PeerConnection(options);

    return {
      pc1: pc1,
      pc2: null,
      offer: null,
      answer: null
    };
  },

  onIceCandidate: function (e) {
    console.log(e.candidate, e);

    // candidate exists in e.candidate
    if (e.candidate == null) { return }

    this.sendSignal("icecandidate", e.candidate);

    //pc.onicecandidate = null;

    //this.state.pc1.addIceCandidate(e);
  },

  /*
  onIceCandidate2: function (e) {
    console.log(e.candidate, e);

    // candidate exists in e.candidate
    if (e.candidate == null) { return }

    //send("icecandidate", JSON.stringify(e.candidate));

    //pc.onicecandidate = null;

    this.state.pc2.addIceCandidate(e);
  },
  */

  onError: function(err) {
    //console.log("ERROR", err.message);
  },

  onOfferCreated: function(description) {
    this.state.offer = description;
    this.state.pc1.setLocalDescription(this.state.offer);
    //this.state.pc1.setLocalDescription(this.state.offer, this.onPc1LocalDescriptionSet, this.onError);

    this.sendSignal("offer", this.state.offer);
  },

  onPc1LocalDescriptionSet: function() {
    // after this function returns, pc1 will start firing icecandidate events
    this.state.pc2.setRemoteDescription(this.state.offer, this.onPc2RemoteDescriptionSet, this.onError);
  },
  
  //onPc2RemoteDescriptionSet: function() {
  //  this.state.pc2.createAnswer(this.onAnswerCreated, this.onError);
  //},

  onAnswerCreated: function(description) {
    this.state.answer = description;
    this.state.pc2.setLocalDescription(this.state.answer, this.onPc2LocalDescriptionSet, this.onError);

    //send("answer", JSON.stringify(answer));
  },

  //onPc2LocalDescriptionSet: function() {
  //  // after this function returns, you'll start getting icecandidate events on pc2
  //  this.state.pc1.setRemoteDescription(this.state.answer, this.onPc1RemoteDescriptionSet, this.onError);
  //},

  onPc1RemoteDescriptionSet: function() {
    console.log('Yay, we finished signaling offers and answers');
  },

  onCreateStream: function(stream) {
    var video = this.refs.localVideo.getDOMNode();
    video.src = URL.createObjectURL(stream);

    this.state.pc1.addStream(stream);
  },

  onAddStream: function(stream) {
    console.log("otherStream", stream);
    //<video id="otherPeer" autoplay></video>
    //var otherPeer = document.getElementById("otherPeer");
    //otherPeer.src = URL.createObjectURL(e.stream);
  },

  componentDidMount: function() {
    this.listenTo(this.state.pc1, 'icecandidate', this.onIceCandidate);
    this.listenTo(this.state.pc1, 'onaddstream', this.onAddStream);
    this.listenTo(centralDispatch, 'recv', this.recvSignal);

    pc1.createOffer(this.onOfferCreated, this.onError);

    var mediaOptions = {
      video: true,
      audio: true
    };

    navigator.getUserMedia(mediaOptions, this.onCreateStream, this.onError);
  },

  render: function() {
    return (
      <div>
        <div>
          <video ref="localVideo" autoPlay></video>
        </div>
        <div ref="remoteVideos">
        </div>
      </div>
    );
  }
});

module.exports = Rtc;
