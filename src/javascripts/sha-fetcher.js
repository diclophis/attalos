// shaFetcher(filename, callbackFn(sha));

var crypto = require('crypto');
var fs = require('fs');


module.exports = function(fn, cb) {
  var shasum = crypto.createHash('sha1');
  var s = fs.ReadStream(fn);

  s.on('data', function(d) {
    shasum.update(d);
  });

  s.on('end', function() {
    var d = shasum.digest('hex');
    cb(d);
  });
};
