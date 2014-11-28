var _ = require('lodash');
var d3 = window.d3;

var scales = require('../../util/scales');

d3.chart('BGAxis', {
  initialize: function() {
    var chart = this;

    var axisGroup = this.base.append('g').attr({
      'class': 'BGAxis',
      display: 'none'
    });

    this.showAxis = function() {
      axisGroup.attr('display', 'inline');
    };

    this.hideAxis = function() {
      axisGroup.attr('display', 'none');
    };

    this.shiftAxis = function(xTranslation) {
      axisGroup.attr('transform', 'translate(' + xTranslation + ',0)');
    };

    this.layer('BGAxis-ticklines', axisGroup.append('g').attr({
      'class': 'BGAxis-ticklines'
    }), {
      dataBind: function(data) {
        return this.selectAll('line')
          .data(data);
      },
      insert: function() {
        return this.append('line');
      },
      events: {
        enter: function() {
          var opts = chart.opts(), yScale = chart.yScale();
          this.attr({
            x1: 0,
            x2: opts.tickLength,
            y1: yScale,
            y2: yScale
          });
        }
      }
    });

    this.layer('BGAxis-text', axisGroup.append('g').attr({
      'class': 'BGAxis-text'
    }), {
      dataBind: function(data) {
        return this.selectAll('text')
          .data(data);
      },
      insert: function() {
        return this.append('text');
      },
      events: {
        enter: function() {
          var opts = chart.opts(), yScale = chart.yScale();
          this.attr({
            x: opts.tickLength + chart.textSpacer(),
            y: yScale
          })
          .text(function(d) { return d; });
          var widths = [];
          _.each(axisGroup.selectAll('text')[0], function(node) {
            widths.push(node.offsetWidth);
          });
          var basePad = opts.tickLength + chart.textSpacer();
          chart.rectPad(d3.max(widths) + basePad);
        }
      }
    });

    this.layer('BGAxis-background', axisGroup.insert('g', '.BGAxis-ticklines').attr({
      'class': 'BGAxis-background'
    }), {
      dataBind: function(data) {
        return this.selectAll('rect')
          .data([data]);
      },
      insert: function() {
        return this.append('rect');
      },
      events: {
        enter: function() {
          var opts = chart.opts(), yScale = chart.yScale();
          this.attr({
            x: 0,
            y: 0,
            width: opts.tickLength + chart.textSpacer() + chart.rectPad(),
            height: chart.height()
          });
        }
      }
    });
  },
  emitter: function(emitter) {
    if (!arguments.length) { return this._emitter; }
    this._emitter = emitter;
    emitter.on('focusCBG', this.showAxis);
    emitter.on('focusSMBG', this.showAxis);
    emitter.on('unfocusCBG', this.hideAxis);
    emitter.on('unfocusSMBG', this.hideAxis);
    emitter.on('leftEdge', this.shiftAxis);
    return this;
  },
  height: function(height) {
    if (!arguments.length) { return this._height; }
    this._height = height;
    this.yScale(height);
    return this;
  },
  remove: function() {
    this.base.remove();

    return this;
  },
  opts: function(opts) {
    if (!arguments.length) { return this._opts; }
    this._opts = opts;
    return this;
  },
  rectPad: function(rectPad) {
    if (!arguments.length) { return this._rectPad; }
    this._rectPad = rectPad;
    return this;
  },
  textSpacer: function(textSpacer) {
    if (!arguments.length) { return this._textSpacer; }
    this._textSpacer = textSpacer;
    return this;
  },
  yScale: function(height) {
    if (!arguments.length) { return this._yScale; }
    this._yScale = scales.bg(height, this.opts().scaleR*2);
    return this;
  }
});

module.exports = function() {
  var chart;

  return {
    create: function(el, opts) {
      opts = opts || {};
      var defaults = {
        textSpacer: 5
      };
      _.defaults(opts, defaults);

      chart = el.chart('BGAxis')
        .emitter(opts.emitter)
        .opts(opts.opts)
        .height(opts.height)
        .textSpacer(opts.textSpacer);

      return this;
    },
    render: function(data) {
      chart.draw(data);

      return this;
    },
    destroy: function() {
      chart.remove();

      return this;
    }
  };
};