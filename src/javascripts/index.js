// Isomorphic Single Page Javascript Application

var React = require('react');
var AttalosComponent = require('./attalos');

module.exports = {};

//=> var bootstrap = function(exportedPackageName, containerElement) {}
module.exports.bootstrap = function(exp, boshHost, boshPort, mainContainer) {
  exp.attach(boshHost, boshPort, mainContainer);
  mainContainer.className = "bootstrapped";
};

module.exports.render = function(packageModule, js, css, cb) {
  var IndexComponent = React.createClass({
    render: function() {
      var boshHost = "";
      if (typeof(process) === "object" && typeof(process.env) === "object") {
        boshHost = process.env.DEFAULT_BOSH_HOST;
      }

      var boshPort = 0;
      if (typeof(process) === "object" && typeof(process.env) === "object") {
        boshPort = parseInt(process.env.DEFAULT_BOSH_PORT);
      }

      var mainContainerId = packageModule.toLowerCase() + "-container";
      var bootstrapFunction = '(' + module.exports.bootstrap.toString() + ')';
      var bootstrapInvokation = '(' + packageModule + ', "' + boshHost + '", ' + boshPort + ', document.getElementById("' + mainContainerId + '"));';
      var bootstrapSource = (bootstrapFunction + bootstrapInvokation).replace('\n', ''); //=> bootstrap('ModulePackageName', document.getElementById('main-container');
      return(
        <html>
          <head>
            <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
            <title>Attalos Index</title>
            <link href={this.props.css} media="all" rel="stylesheet" type="text/css" />
            <link rel="icon" href="data:;base64,iVBORw0KGgo=" />
          </head>
          <body>
            <div id={mainContainerId} className="static">
              <AttalosComponent bootstrapped={false} boshPort={boshPort} boshHost={boshHost}/>
            </div>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html:'__REACT_DEVTOOLS_GLOBAL_HOOK__ = {};'}}></script>
            <script type="text/javascript" src={this.props.js}></script>
            <script type="text/javascript" dangerouslySetInnerHTML={{__html:bootstrapSource}}></script>
          </body>
        </html>
      );
    }
  });
  return '<!DOCTYPE html>' + React.renderToStaticMarkup(<IndexComponent js={js} css={css} />);
};

module.exports.attach = function(boshHost, boshPort, mainContainer) {
  return React.render(<AttalosComponent boshHost={boshHost} boshPort={boshPort} bootstrapped={true} />, mainContainer);
};
