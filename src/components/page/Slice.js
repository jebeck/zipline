/** @jsx React.DOM */
var React = require('react/addons');

var cx = require('classnames');

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
    return (
      <div className={sliceClass} ref={this.props.slice.get('id')}>
        {label || null}
      </div>
    );
  },
  renderLabel: function(label) {
    var Label = label.get('component');
    return (
      <Label fixed={true} large={!this.props.dashboard} text={label.get('text')} id={this.props.slice.get('id') + 'Label'} />
    );
  },
});

module.exports = Slice;