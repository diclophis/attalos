var React = require('react');
var url = require('url');
var vent = require('./vent').vent;

var Anchor = React.createClass({
  onClick: function(ev) {
    ev.preventDefault(ev);
    history.pushState({}, "", ev.target.href);
    vent.emit('popstate', {});
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
