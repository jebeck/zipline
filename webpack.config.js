var path = require('path');

module.exports = {
  entry: './example/main.js',
  output: {
    path: path.join(__dirname, 'example'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.js$/, loader: 'jsx-loader'},
      {test: /\.less$/, loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'},
      {test: /\.ttf$/, loader: 'url-loader?mimetype=application/x-font-ttf'}
    ]
  }
};
