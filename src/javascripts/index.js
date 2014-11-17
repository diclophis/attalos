// something

var React = require('react'),
    AttalosComponent = require('./attalos');

document.addEventListener("DOMContentLoaded", function() {
  var mainComponent = <AttalosComponent/>;
  var mainContainer = document.getElementById("main-container");
  React.render(mainComponent, mainContainer);
})
