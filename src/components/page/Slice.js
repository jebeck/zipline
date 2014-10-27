/** @jsx React.DOM */
var React = require('react/addons');
var cx = React.addons.classSet;

var Slice = React.createClass({
  propTypes: {
    dashboard: React.PropTypes.bool.isRequired,
    slice: React.PropTypes.object.isRequired
  },
  render: function() {
    var slice = this.props.slice;
    var sliceClass = cx({
      'Slice': true,
      'Slice-half': slice.weight === 0.5,
      'Slice--single': slice.weight === 1,
      'Slice--double': slice.weight === 2,
      'Slice--triple': slice.weight === 3
    });
    label = slice.label ? this.renderLabel(slice.label) : null;
    /* jshint ignore:start */
    return (
      <div className={sliceClass} ref={this.props.slice.id}>
        {label || null}
      </div>
    );
    /* jshint ignore:end */
  },
  renderLabel: function(label) {
    var Label = label.component;
    /* jshint ignore:start */
    return (
      <Label large={!this.props.dashboard} text={label.text} id={this.props.slice.id + 'Label'} />
    );
    /* jshint ignore:end */
  },
});

module.exports = Slice;