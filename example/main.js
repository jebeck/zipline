var React = require('react');

require('style!css!vc-reset-css/reset.min.css');
require('style!css!../fontello/css/zipline.css');
require('./less/example.less');

var App = require('./App');

window.app = React.render(<App />, document.body);