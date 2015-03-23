/** @jsx React.DOM */
var React = require('react');

var DetailsCollapsible = React.createClass({
  propTypes: {
    header: React.PropTypes.string.isRequired,
    toCollapse: React.PropTypes.element.isRequired
  },
  getInitialState: function() {
    return {
      height: null,
      open: true
    };
  },
  componentDidMount: function() {
    // TODO: figure out a better way to test without the fallback to 100
    this.fullHeight = this.refs.collapsible.getDOMNode().offsetHeight || 100;
    this.setState({
      height: this.fullHeight
    });
  },
  render: function() {
    var icon = this.renderIcon();
    return (
      <div>
        <h3>
          <span>{this.props.header} </span>
          {icon}
        </h3>
        <div className='Details--collapsible' style={{height: this.state.height}} ref='collapsible'>
          {this.props.toCollapse}
        </div>
      </div>
    );
  },
  renderIcon: function() {
    if (this.state.open) {
      return (
        <a href="" onClick={this.handleCollapse}><i className='icon-subtract'></i></a>
      );
    }
    else {
      return (
        <a href="" onClick={this.handleOpen}><i className='icon-add'></i></a>
      );
    }
  },
  handleCollapse: function(e) {
    e.preventDefault();
    this.setState({
      height: 0,
      open: false
    });
  },
  handleOpen: function(e) {
    e.preventDefault();
    this.setState({
      height: this.fullHeight,
      open: true
    });
  }
});

module.exports = DetailsCollapsible;