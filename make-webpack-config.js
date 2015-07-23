var webpack = require('webpack');
var path = require('path');

module.exports = function (options) {
  return {
    entry: {
      main: './src/main.jsx',
    },
    output: {
      path: './dist',
      publicPath: '/ui/jazz/',
      filename: 'resources/app.js',
    },
    module: {
      loaders: [
        {
          test: /\.(jsx)$/,
          loaders: options.hotComponents ? ['react-hot', 'babel'] : ['babel'],
          include: path.join(__dirname, 'src'),
        },
        {
          test: /\.(js)$/,
          loaders: ['babel'],
          include: path.join(__dirname, 'src'),
        },
      ]
    },
    devServer: {
      proxy: {
        '*': 'http://localhost:4000',
      }
    },
  }
};
