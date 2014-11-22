var React = require('react');
var xmpp = require('stanza.io');
var url = require('url');

var CreateRoom = React.createClass({
  onCreatedRoom: function(ev) {
    ev.preventDefault();
    room = this.getDOMNode();
    form = url.parse(room.action, true);
    console.log(room.action, form, form.queryString);
    window.location.hash = form.hash;


    //var data = new FormData(form);
    //history.pushState(data, "", null);

    //this.props.children;

    //React.Children.map(this.props.children, function(a) {
    //  console.log(a);
    //});

    //debugger;

  },
  render: function() {
    return (
      <form action="#room" onSubmit={this.onCreatedRoom}>
        <input name="description" type="text" placeholder="name of room/discussion" />
        <button>CREATE ROOM</button>
      </form>
    );
  }
});

module.exports = CreateRoom;
