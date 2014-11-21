var EventEmitter = require('events').EventEmitter;

exports.vent = new EventEmitter();

exports.vent.on('VENT-DEBUG', function(msg) {
  console.log('VENT-DEBUG:', msg);
});
