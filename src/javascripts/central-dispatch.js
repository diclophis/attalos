// global event bus

var EventEmitter = require('events').EventEmitter;
var url = require('url');
var slug = require('./slug'); //TODO: spec this
var xmpp = require('stanza.io');

var cd = new EventEmitter();

cd.client = xmpp.createClient({
});

cd.navigateTo = function(href) {
  history.pushState({}, "", href);
  this.emit('popstate', {});
}

cd.login = function(loggedIn) {
  this.emit('login', loggedIn);
};

cd.logout = function(loggedIn) {
  this.emit('logout', loggedIn);
};

cd.message = function(msg) {
  this.emit("recv", msg);
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

//TODO: figure out a better factorization of this 2.0
cd.addMainHandler = function(listener) {
  listener.listenTo(this.client, 'session:started', listener.onSessionStarted);
  listener.listenTo(this.client, 'disconnected', listener.onSessionDisconnected);

  // main connection between centralDispatch and client, this needs to be shifted
  listener.listenTo(this.client, 'chat', listener.onChat);
  listener.listenTo(this.client, 'groupchat', listener.onChat);
  listener.listenTo(this.client, 'presence', listener.onPresence);
  listener.listenTo(this.client, '*', listener.onDebug);

  listener.listenTo(this, 'send', listener.willSendChat);
  listener.listenTo(this, 'room:join', listener.willJoinRoom);
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

exports.singleton = cd;
