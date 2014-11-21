// something

var React = require('react');
var AttalosComponent = require('./attalos');

var IndexComponent = React.createClass({
  render: function() {
    return(
      <html>
        <head>
          <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
          <title>Attalos Index</title>
          <link href={this.props.css} media="all" rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="main-container" className="grid-fluid">
          </div>
          <script src={this.props.js}></script>
        </body>
      </html>
    );
  }
});

module.exports = IndexComponent;

(function() {
  if (typeof(document) === 'undefined') {
    var dist = (process.argv.indexOf("--dist") != -1);

    var js = dist ? "javascripts/application.min.js" : "javascripts/application.js"
    var css = dist ? "stylesheets/application.min.css" : "stylesheets/application.css"

    //var idx = React.createElement(IndexComponent, null);
    //console.log(idx);
    //idx.setState({dist: (process.argv.indexOf("--dist") != -1)});
    console.log(React.renderToStaticMarkup(<IndexComponent js={js} css={css} />));
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      var mainContainer = document.getElementById("main-container");
      React.render(<AttalosComponent />, mainContainer);
    });
  }
})();
