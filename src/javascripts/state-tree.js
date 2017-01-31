//

var Baobab = require('baobab');
var ReactAddons = require('react/addons');


var initialStateTree = {
  defaults: {
    connections: []
  },
  views: []
};

var stateTree = new Baobab(
  initialStateTree,
  {
    mixins: [ReactAddons.PureRenderMixin],
    shiftReferences: true,
    autoCommit: true
  }
);

var storableCursor = stateTree.select('defaults');

if (typeof(window) === 'object' && typeof(navigator) == 'object') {
  window.addEventListener('beforeunload', function(e) {
    storableCursor.set('lastSaved', new Date());
    stateTree.commit();
    var jsonToStore = JSON.stringify(storableCursor.get());
    localStorage.setItem('defaults', jsonToStore);
  }, false);

  var storedStateTree = localStorage.getItem('defaults');

  if (true && storedStateTree) {
    var parsedStoredStateTree = JSON.parse(storedStateTree);
    parsedStoredStateTree.lastLoad = new Date().toJSON();
    storableCursor.merge(parsedStoredStateTree);
    stateTree.commit();
  }
}


module.exports = stateTree;
