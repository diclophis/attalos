//

var Baobab = require('baobab');

var defaultStateTree = {
  fromStorage: false,
  views: [],
};

var stateTree = new Baobab(defaultStateTree);
var storableCursor = stateTree.select('fromStorage', 'views');

if (typeof(window) === 'object' && typeof(navigator) == 'object') {
  window.addEventListener('beforeunload', function(e) {
    var jsonToStore = JSON.stringify(storableCursor.get());
    console.log('save:', storableCursor, jsonToStore, storableCursor.get());
  //  localStorage.setItem('stateTree', jsonToStore);
  }, false);

  //var storedStateTree = localStorage.getItem('stateTree');

  console.log("wtf", storableCursor.get());

  //if (storedStateTree) {
  //  var parsedStoredStateTree = JSON.parse(storedStateTree);
  //  storableCursor.merge(parsedStoredStateTree);
  //}
  //console.log(JSON.stringify(stateTree));
}

module.exports = stateTree;
