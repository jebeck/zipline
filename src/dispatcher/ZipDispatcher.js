var assign = require('object-assign');
var Dispatcher = require('flux').Dispatcher;

module.exports = assign(new Dispatcher(), {
  handleConfigAction: function(action) {
    this.dispatch({
      source: 'CONFIG_ACTION',
      action: action
    });
  },
  handleDataAction: function(action) {
    this.dispatch({
      source: 'DATA_ACTION',
      action: action
    });
  }
});