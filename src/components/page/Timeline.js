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
    zipConfig: React.PropTypes.object.isRequired
  },
  componentDidMount: function() {
    var zipline = Zipline.create(this.refs.zipline.getDOMNode(), this.props.timezone, {});
    this.setState({
      zipline: zipline
    });
    zipline.render(this.props.zipConfig.slices);
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
  }
});

module.exports = Timeline;