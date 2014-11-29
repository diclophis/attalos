// more reactful form of <a href=...> tags

var React = require('react');
var url = require('url');
var centralDispatch = require('./central-dispatch').singleton;

var Anchor = React.createClass({
  onClick: function(ev) {
    ev.preventDefault(ev);
    centralDispatch.navigateTo(ev.target.href);
  },

  render: function() {
    return (
      <a className={(this.props.className || '') + ' attalos-a'} href={this.props.href} onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Anchor;
