var _ = require('lodash');
var d3 = window.d3;
var moment = require('moment-timezone');

var reuse = require('../../util/reusenodes');

d3.chart('Background').extend('TimeLabels', {
  initialize: function() {
    var chart = this;

    this.layer('Background-labels', this.base.append('g').attr({
      'class': 'Background-labels'
    }), {
      dataBind: function(data) {
        return reuse(this.selectAll('text').data(data, function(d) {
          return d;
        }));
        // commented out = vanilla enter selection, without reusing nodes
        // return this.selectAll('text').data(data, function(d) {
        //   return d;
        // });
      },
      insert: function() {
        return this.append('text')
          .attr({
            y: chart.height()/2,
            'class': 'Background-label'
          });
      },
      events: {
        merge: function() {
          var xScale = chart.xScale(), timezone = chart.timezone();
          var opts = chart.opts();
          this.attr({
            x: function(d) {
              return xScale(d) + opts.shiftRight;
            }
          })
          .text(function(d) {
            return moment(d).tz(timezone).format(opts.format);
          });
        },
        exit: function() {
          this.remove();
        }
      }
    });
  }
});