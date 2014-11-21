// something

var React = require('react');
var AttalosComponent = require('./attalos');

var Index = React.createClass({
  render: function() {
    return(
      <html>
        <head>
          <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
          <title>Attalos Index</title>
          <link href="stylesheets/application.min.css" media="all" rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="main-container" className="grid-fluid">
          </div>
          <script src="javascripts/application.min.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = Index;

(function() {
  if (typeof(document) === 'undefined') {
    console.log(React.renderToStaticMarkup(<Index />));
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      var mainContainer = document.getElementById("main-container");
      React.render(<AttalosComponent />, mainContainer);
    });
  }
})();
