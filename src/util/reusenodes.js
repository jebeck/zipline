module.exports = function(selection) {
  if (!(selection.enter().empty() || selection.exit().empty())) {
    var entering = selection.enter()[0], toEnter = [];
    for (var i = 0; i < entering.length; ++i) {
      var ent = entering[i];
      if (ent) {
        toEnter.push(i);
      }
    }
    var exiting = selection.exit()[0];
    for (var j = 0; j < exiting.length; ++j) {
      var ex = exiting[j];
      if (toEnter.length > 0 && ex) {
        ex.__data__ = entering.splice(toEnter.pop(), 1)[0].__data__;
        selection.enter()[0].update.push(d3.select(ex)[0][0]);
        exiting[j] = undefined;
      }
    }    
  }
  return selection;
};