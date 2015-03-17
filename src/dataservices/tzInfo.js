module.exports = function(intervals) {
  return function(datetime) {
    for (var i = intervals.length - 1; i >= 0; --i) {
      var s = Date.parse(intervals[i].start), e = Date.parse(intervals[i].end);
      if (Date.parse(datetime) >= s && Date.parse(datetime) <= e) {
        return intervals[i].timezone;
      }
    }
    return null;
  };
};