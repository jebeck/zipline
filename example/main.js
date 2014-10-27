var React = require('react');

require('css!vc-reset-css/reset.min.css');
require('./less/example.less');

var App = require('./App');

window.app = React.renderComponent(App(), document.body);