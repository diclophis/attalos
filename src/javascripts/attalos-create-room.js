var React = require('react'),
  mui = require('material-ui'),
  Input = mui.Input,
  PaperButton = mui.PaperButton;

var AttalosCreateRoom = React.createClass({
  onCreatedRoom: function() {
    console.log(this.getDOMNode());
  },
  render: function() {
    return (
      <form className="c6">
        <Input name="room" type="text" description="typically used as the topic of discussion" placeholder="name of room"/>
        <PaperButton onClick={this.onCreatedRoom} type={PaperButton.Types.FLAT} label="CREATE ROOM"/>
      </form>
    );
  }
});

module.exports = AttalosCreateRoom;
