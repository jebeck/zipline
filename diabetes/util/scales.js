var d3 = window.d3;

module.exports = {
  bg: function(height, pad) {
    return d3.scale.linear()
      .domain([0, 401])
      .range([pad, height - pad]);
  }
};