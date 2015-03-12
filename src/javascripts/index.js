// Isomorphic Single Page Javascript Application

var React = require('react');
var AttalosComponent = require('./attalos');

module.exports = {};

//=> var bootstrap = function(exportedPackageName, containerElement) {}
module.exports.bootstrap = function(exp, mainContainer) {
  exp.attach(mainContainer);
  mainContainer.className = "bootstrapped";
};

module.exports.render = function(packageModule, js, css, cb) {
  var IndexComponent = React.createClass({
    render: function() {
      var mainContainerId = packageModule.toLowerCase() + "-container";
      var bootstrapFunction = '(' + module.exports.bootstrap.toString() + ')';
      var bootstrapInvokation = '(' + packageModule + ', document.getElementById("' + mainContainerId + '"));';
      var bootstrapSource = (bootstrapFunction + bootstrapInvokation).replace('\n', ''); //=> bootstrap('ModulePackageName', document.getElementById('main-container');
      return(
        <html>
          <head>
            <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
            <title>Attalos Index</title>
            <link href={this.props.css} media="all" rel="stylesheet" type="text/css" />
          </head>
          <body>
            <div id={mainContainerId} className="static">
              <AttalosComponent bootstrapped={false}/>
            </div>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html:'__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};'}}></script>
            <script type="text/javascript" src={this.props.js}></script>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html:bootstrapSource}}></script>
          </body>
        </html>
      );
    }
  });
  return '<!DOCTYPE HTML SYSTEM>' + React.renderToStaticMarkup(<IndexComponent js={js} css={css} />);
};

module.exports.attach = function(mainContainer) {
  return React.render(<AttalosComponent bootstrapped={true}/>, mainContainer);
};
