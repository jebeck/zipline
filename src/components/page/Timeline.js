/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var Slice = require('./Slice');
var Zipline = require('../../Zipline');

var Timeline = React.createClass({
  propTypes: {
    details: React.PropTypes.bool.isRequired,
    dashboard: React.PropTypes.bool.isRequired,
    timezone: React.PropTypes.string.isRequired,
    zipConfig: React.PropTypes.object.isRequired,
    onNavigation: React.PropTypes.func.isRequired
  },
  componentDidMount: function() {
    var zipNode = this.refs.zipline.getDOMNode();
    var zipConfig = this.props.zipConfig;
    var opts = zipConfig.opts || {};
    var zipline = Zipline().create(zipNode, this.props.timezone, opts);
    zipline.render(zipConfig.slices);
    d3.select(window).on('resize', function() {
      zipline.clear();
      var dims = zipline.getDimensions(zipNode, opts.scroll === 'horizontal', opts.timespan);
      zipline.resize(dims).render(zipConfig.slices).relocate();
    });
    this.chart = zipline;
    this.bindEvents();
  },
  render: function() {
    var timelineClass = cx({
      'FlexItem': true,
      'FlexItem-timeline': true,
      'FlexItem-timeline--alone': !this.props.details,
      'Timeline': true
    });

    var ziplineClass = cx({
      'Zipline': true
    });

    var slices = this.renderSlices();
    /* jshint ignore:start */
    return (
      <div className={timelineClass}>
        <div className="Chrome"></div>
        <div className={ziplineClass} ref="zipline">{slices}</div>
      </div>
    );
    /* jshint ignore:end */
  },
  renderSlices: function() {
    // TODO: add error handling
    var configs = this.props.zipConfig.slices;
    var components = [];
    for (var i = 0; i < configs.length; ++i) {
      var slice = configs[i];
      /* jshint ignore:start */
      components.push(
        <Slice dashboard={this.props.dashboard} slice={slice} key={slice.id} />
      );
      /* jshint ignore:end */
    }
    return components;
  },
  bindEvents: function() {
    this.chart.emitter.on('navigatedToCenter', this.props.onNavigation);
  }
});

module.exports = Timeline;