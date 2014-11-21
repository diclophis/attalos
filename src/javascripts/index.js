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
          <div id="main-container" className="static">
            <AttalosComponent bootstrapped={false}/>
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

    console.log(React.renderToStaticMarkup(<IndexComponent js={js} css={css} />));
  } else {
    document.addEventListener("DOMContentLoaded", function() {
      var mainContainer = document.getElementById("main-container");
      React.render(<AttalosComponent bootstrapped={true}/>, mainContainer);
      mainContainer.className = "bootstrapped";
    });
  }
})();
