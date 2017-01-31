// more reactful form of <a href=...> tags

var React = require('react');
var classNames = require('classnames');

var centralDispatch = require('./central-dispatch').singleton;


var Anchor = React.createClass({
  onClick: function(ev) {
    ev.preventDefault(ev);
    centralDispatch.navigateTo(ev.target.href);
  },

  render: function() {
    // adds default class to all Anchor tags
    var classes = {
      'attalos-a': true
    }

    classes[this.props.className] = true;

    return (
      <a className={classNames(classes)} href={this.props.href} onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});


module.exports = Anchor;
