var path = require('path');
var webpack = require('webpack');

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
});

module.exports = {
  entry: './example/main.js',
  output: {
    path: path.join(__dirname, 'example'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.eot/, loader: 'url-loader?mimetype=application/vnd.ms-fontobject'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'},
      {test: /\.svg/, loader: 'url-loader?mimetype=image/svg+xml'},
      {test: /\.ttf/, loader: 'url-loader?mimetype=application/x-font-ttf'},
      {test: /\.woff/, loader: 'url-loader?mimetype=application/font-woff'}
    ]
  },
  plugins: [definePlugin]
};
