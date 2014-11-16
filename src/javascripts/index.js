// something

var React = require('react'),
    AttalosComponent = require('./attalos');

document.addEventListener("DOMContentLoaded", function() {
  var mainContainer = document.getElementById("main-container");
  React.render(<AttalosComponent/>, mainContainer);
})
