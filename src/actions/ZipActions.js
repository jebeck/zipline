var bows = require('bows');
var debug = bows('Flux Action');

var ZipConstants = require('../constants/ZipConstants');
var ZipDispatcher = require('../dispatcher/ZipDispatcher');

var _lastDate = null;

module.exports = {
  filterData: function(bounds) {
    // this is pretty noisy in the console
    // var center = (bounds[0].valueOf() + bounds[1].valueOf())/2;
    // if (Math.abs(center - _lastDate) > 864e5) {
    //   _lastDate = center;
    //   debug('FILTER_DATA: center', new Date(center).toISOString());
    // }
    ZipDispatcher.handleDataAction({
      actionType: ZipConstants.FILTER_DATA,
      bounds: bounds
    });
  },
  focus: function(data) {
    debug('FOCUS_DATA:', data);
    ZipDispatcher.handleDataAction({
      actionType: ZipConstants.FOCUS_DATA,
      data: data
    });
  },
  initializeConfig: function(baseConfig) {
    debug('INIT_CONFIG:', baseConfig);
    ZipDispatcher.handleConfigAction({
      actionType: ZipConstants.INIT_CONFIG,
      baseConfig: baseConfig
    });
  },
  initializeData: function(allData, plotTypes) {
    debug('INIT_DATA:', allData.length, 'datums loaded');
    ZipDispatcher.handleDataAction({
      actionType: ZipConstants.INIT_DATA,
      allData: allData,
      plotTypes: plotTypes
    });
  },
  unfocus: function() {
    debug('UNFOCUS_DATA');
    ZipDispatcher.handleDataAction({
      actionType: ZipConstants.UNFOCUS_DATA
    });
  }
};