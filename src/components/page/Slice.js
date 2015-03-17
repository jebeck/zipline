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
      'Slice-half': slice.get('weight') === 0.5,
      'Slice--single': slice.get('weight') === 1,
      'Slice--double': slice.get('weight') === 2,
      'Slice--triple': slice.get('weight') === 3
    });
    label = slice.get('label') ? this.renderLabel(slice.get('label')) : null;
    /* jshint ignore:start */
    return (
      <div className={sliceClass} ref={this.props.slice.get('id')}>
        {label || null}
      </div>
    );
    /* jshint ignore:end */
  },
  renderLabel: function(label) {
    var Label = label.get('component');
    /* jshint ignore:start */
    return (
      <Label fixed={true} large={!this.props.dashboard} text={label.get('text')} id={this.props.slice.get('id') + 'Label'} />
    );
    /* jshint ignore:end */
  },
});

module.exports = Slice;