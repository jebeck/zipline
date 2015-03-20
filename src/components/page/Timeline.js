/** @jsx React.DOM */
var React = require('react/addons');

var _ = require('lodash');
var bows = require('bows');
var cx = require('classnames');
var Immutable = require('immutable');

var Chrome = require('./Chrome');
var Label = require('../horizontal/Label');
var Slice = require('./Slice');
var ZipActions = require('../../actions/ZipActions');
var Zipline = require('../../Zipline');

var debug = bows('Timeline');

var Timeline = React.createClass({
  propTypes: {
    details: React.PropTypes.bool.isRequired,
    dashboard: React.PropTypes.bool.isRequired,
    createConfig: React.PropTypes.object.isRequired,
    drawConfig: React.PropTypes.object.isRequired,
    dataBySlice: React.PropTypes.object.isRequired,
    edgeLocation: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    return {
      fastBack: _.noop,
      fastForward: _.noop,
      panBack: _.noop,
      panForward: _.noop
    };
  },
  componentDidMount: function() {
    var self = this;

    var zipNode = this.refs.zipline.getDOMNode();
    var zipline = Zipline().create(zipNode, this.props.createConfig.toJS());
    zipline.configure(this.props.drawConfig.toJS())
      .relocate(this.props.edgeLocation.valueOf())
      .render(this.props.dataBySlice.toJS());
    d3.select(window).on('resize', function() {
      zipline.clear();
      var location = zipline.resize();
      zipline.configure(self.props.drawConfig.toJS())
        .relocate(location)
        .render(self.props.dataBySlice.toJS());
    });
    this.chart = zipline;
    this.setState({
      fastBack: zipline.relocate.bind(null, {scrollPosition: 0}),
      fastForward: zipline.relocate.bind(null, this.props.edgeLocation.valueOf()),
      panBack: zipline.pan.bind(null, -864e5),
      panForward: zipline.pan.bind(null, 864e5)
    });
  },
  componentWillUpdate: function(nextProps, nextState) {
    if (!Immutable.is(this.props.dataBySlice, nextProps.dataBySlice)) {
      // this is pretty noisy in the console
      // debug('Rerender in componentWillUpdate');
      this.chart.render(nextProps.dataBySlice.toJS());
    }
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

    var label = this.renderLabel();

    var slices = this.renderSlices();
    return (
      <div className={timelineClass}>
        <Chrome large={!this.props.dashboard}
          onClickFastBack={this.state.fastBack}
          onClickFastForward={this.state.fastForward}
          onClickLeft={this.state.panBack}
          onClickRight={this.state.panForward} />
        {label}
        <div className={ziplineClass} ref="zipline">{slices}</div>
      </div>
    );
  },
  renderLabel: function() {
    var label = this.props.createConfig.get('label') || null;
    if (!label) {
      return null;
    }

    var Label = label.get('component');
    return (
      <Label fixed={false} large={!this.props.dashboard} text={label.get('text')} id={'ZiplineLabel'}/>
    );
  },
  renderSlices: function() {
    var self = this;

    var slices = this.props.drawConfig;
    var components = [];
    slices.forEach(function(slice) {
      components.push(
        <Slice dashboard={self.props.dashboard} slice={slice} key={slice.get('id')} />
      );
    });
    return components;
  }
});

module.exports = Timeline;