module.exports = (function() {
  if (typeof window !== undefined && __DEV__ === true) {
    return {
      start: function(name) {
        console.time(name);
      },
      end: function(name) {
        console.timeEnd(name);
      }
    };
  }
  else {
    return {
      start: function(name) {
        return;
      },
      end: function(name) {
        return;
      }
    };
  }
}());