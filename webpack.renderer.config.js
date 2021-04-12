const path = require('path');
const HtmlWepbackPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts'],
  },
  devtool: 'source-map',
  entry: ['./src/index.js'],
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: true,
    port: 3000,
    publicPath: '/',
  },
  plugins: [
    new HtmlWepbackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
  ],
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
