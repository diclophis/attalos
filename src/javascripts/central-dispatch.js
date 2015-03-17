// global event bus

var EventEmitter = require('events').EventEmitter;
var url = require('url');
var slug = require('./slug'); //TODO: spec this
var xmpp = {}; //require('stanza.io');

var cd = new EventEmitter();

cd.loggedIn = false;
cd.isConnecting = false;

//cd.client = xmpp.createClient({
//});

cd.navigateTo = function(href) {
  history.pushState({}, "", href);
  this.emit('popstate', {});
}

cd.login = function(loggedIn) {
  this.loggedIn = loggedIn;
  this.emit('login', loggedIn);
};

cd.logout = function(loggedIn) {
  this.loggedIn = loggedIn;
  this.isConnecting = false;
  this.emit('logout', loggedIn);
};

cd.message = function(msg) {
  cd.emit("recv", msg);
};

cd.send = function(msg) {
  this.emit("send", msg);
};

cd.joinRoom = function(roomName) {
  this.emit("room:join", roomName);
};

cd.joinedRoom = function(presenceStanza) {
  this.emit("joined:room", presenceStanza);
};

cd.addLoginLogoutHandler = function(listener, fnCb) {
  listener.listenTo(this, 'login', fnCb);
  listener.listenTo(this, 'logout', fnCb);
};

cd.onPresence = function(msg) {
  //TODO: better check here
  if (msg.from.domain.indexOf("conference") != -1) {
    //console.log("joined:room", msg.from.toString(), msg);
    cd.joinedRoom(msg);
  } else {
    //console.log("presence", msg.from.toString(), msg);
  }

  //TODO: figure out more presence info like list of rooms
  //console.log(msg.from.resource);
  //this.setProps({roomMenuItems: (this.props.roomMenuItems || []).concat({ payload: '?controller=room&id=' + msg.from.toString(), text: msg.from.local })});
};

cd.willSendChat = function(msg) {
  cd.client.sendMessage(msg);
};

cd.willJoinRoom = function(id) {
  if (cd.loggedIn) {
    cd.client.joinRoom(id, cd.client.jid.local);
  } else {
    console.error("not logged in");
  }
};

cd.onSessionStarted = function () {
  //this.state.client.getRoster();
  //this.state.client.sendPresence();
  //this.setState({ loggedIn: true })

  cd.login(true);
};

cd.onSessionDisconnected = function () {
  //this.setState({ loggedIn: false, isConnecting: false })

  cd.logout(false);
};


cd.addPopStateHandler = function(listener, fnCb) {
  listener.listenTo(this, 'popstate', fnCb);
  listener.listenTo(window, 'popstate', fnCb);
};

//TODO: move to module, or internalize
cd.getControllerFromHash = function() {
  var newController = null;
  var newId = null;

  if (typeof(window) != 'undefined') {
    var parts = url.parse(window.location.toString(), true);
    if (parts.query.controller) {
      newController = slug(parts.query.controller, 16);
    }

    if (parts.query.id) {
      newId = slug(parts.query.id, 64);
    }
  }

  return {
    controller: newController,
    action: 'index',
    id: newId
  };
};

module.exports.singleton = cd;

/*
cd.client.on('session:started', cd.onSessionStarted);
cd.client.on('disconnected', cd.onSessionDisconnected);
cd.client.on('chat', cd.message);
cd.client.on('groupchat', cd.message);
cd.client.on('presence', cd.onPresence);
cd.on('send', cd.willSendChat);
cd.on('room:join', cd.willJoinRoom);
*/
