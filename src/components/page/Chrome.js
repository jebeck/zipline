/** @jsx React.DOM */
var React = require('react/addons');

var cx = require('classnames');

var Chrome = React.createClass({
  propTypes: {
    large: React.PropTypes.bool.isRequired,
    onClickFastBack: React.PropTypes.func.isRequired,
    onClickFastForward: React.PropTypes.func.isRequired,
    onClickLeft: React.PropTypes.func.isRequired,
    onClickRight: React.PropTypes.func.isRequired
  },
  render: function() {
    var chromeClass = cx({
      'Chrome': true,
      'Chrome--large': this.props.large,
      'Chrome--regular': !this.props.large
    });
    return (
      <div className={chromeClass}>
        <a href="" onClick={this.handleClickFastBack}><i className="icon-fast-backward"></i></a>
        <a href="" onClick={this.handleClickLeft}><i className="icon-left"></i></a>
        <h2>&nbsp;&nbsp;Timeline&nbsp;&nbsp;</h2>
        <a href="" onClick={this.handleClickRight}><i className="icon-right"></i></a>
        <a href="" onClick={this.handleClickFastForward}><i className="icon-fast-forward"></i></a>
      </div>
    );
  },
  handleClickFastBack: function(e) {
    e.preventDefault();
    this.props.onClickFastBack();
  },
  handleClickFastForward: function(e) {
    e.preventDefault();
    this.props.onClickFastForward();
  },
  handleClickLeft: function(e) {
    e.preventDefault();
    this.props.onClickLeft();
  },
  handleClickRight: function(e) {
    e.preventDefault();
    this.props.onClickRight();
  }
});

module.exports = Chrome;