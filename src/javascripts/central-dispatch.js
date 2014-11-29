// global event bus

var EventEmitter = require('events').EventEmitter;

var cd = new EventEmitter();

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

cd.addLoginLogoutHandler = function(listener, fnCb) {
  //this.listenTo(centralDispatch, 'login', this.onLoggedInOrOut);
  //this.listenTo(centralDispatch, 'logout', this.onLoggedInOrOut);
  listener.listenTo(this, 'login', fnCb);
  listener.listenTo(this, 'logout', fnCb);
};

cd.addPopStateHandler = function(listener, fnCb) {
  listener.listenTo(this, 'popstate', fnCb);
  listener.listenTo(window, 'popstate', fnCb);
};

exports.singleton = cd;
