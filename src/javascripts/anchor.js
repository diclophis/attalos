// more reactful form of <a href=...> tags

var React = require('react/addons');
var url = require('url');
var centralDispatch = require('./central-dispatch').singleton;

var Anchor = React.createClass({
  onClick: function(ev) {
    ev.preventDefault(ev);
    centralDispatch.navigateTo(ev.target.href);
  },

  render: function() {
    var classes = {
      'attalos-a': true
    }
    classes[this.props.className] = true;

    return (
      <a className={React.addons.classSet(classes)} href={this.props.href} onClick={this.onClick}>
        {this.props.children}
      </a>
    );
  }
});

module.exports = Anchor;
