// slug(str, len) => turns "foo $#%wtf#$% baz" into "foo-wtf-baz"

module.exports = function(str, len) {
  return str.substr(0, len).replace(' ', '-').replace(/[^0-9A-Za-z\-\@\.]/g, '').toLowerCase();
}
