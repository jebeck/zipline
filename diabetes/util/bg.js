var GLUCOSE_CONVERSION = 18.01559;

module.exports = {
  convertMgdlToMmol: function(n) {
    return n/GLUCOSE_CONVERSION;
  },
  convertMmolToMgdl: function(n) {
    return Math.round(n * GLUCOSE_CONVERSION);
  }
};