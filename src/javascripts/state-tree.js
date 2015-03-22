//

var Baobab = require('baobab');

var initialStateTree = {
  defaults: {
    connections: []
  },
  views: []
};

var stateTree = new Baobab(initialStateTree);
var storableCursor = stateTree.select('defaults');

if (typeof(window) === 'object' && typeof(navigator) == 'object') {
  window.addEventListener('beforeunload', function(e) {
    storableCursor.set('lastSaved', new Date());
    stateTree.commit();
    var jsonToStore = JSON.stringify(storableCursor.get());
    console.log(jsonToStore);
    localStorage.setItem('defaults', jsonToStore);
  }, false);

  var storedStateTree = localStorage.getItem('defaults');

  if (false && storedStateTree) {
    var parsedStoredStateTree = JSON.parse(storedStateTree);
    parsedStoredStateTree.lastLoad = new Date().toJSON();
    storableCursor.merge(parsedStoredStateTree);
    stateTree.commit();
  }

  //console.log("wtf", storableCursor.get());

  //var defaultConnections = stateTree.select('defaults', 'connections');
  //defaultConnections.push({foo: 'bar'});
}


module.exports = stateTree;
