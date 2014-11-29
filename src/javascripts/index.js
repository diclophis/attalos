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
          <script dangerouslySetInnerHTML={{__html:'window["Attalos"].attach("main-container");'}}></script>
        </body>
      </html>
    );
  }
});

module.exports = {
  render: function(js, css, cb) {
    return React.renderToStaticMarkup(<IndexComponent js={js} css={css} />);
  },

  attach: function(mainContainerId) {
    document.addEventListener("DOMContentLoaded", function() {
      var mainContainer = document.getElementById(mainContainerId);
      React.render(<AttalosComponent bootstrapped={true}/>, mainContainer);
      mainContainer.className = "bootstrapped";
    });
  }
};
