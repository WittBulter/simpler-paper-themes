const path = require('path')
const webpackMerge = require('webpack-merge')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base')

module.exports = (async() => {
  const config = await baseConfig
  
  return webpackMerge(config, {
    devtool: 'cheap-module-eval-source-map',
  
    output: {
      path: path.resolve(__dirname, '../dist'),
      publicPath: '/',
      filename: '[name].css',
    },
  
    devServer: {
      historyApiFallback: true,
      contentBase: './examples',
      stats: 'minimal',
    },
  
    plugins: [
      new ExtractTextPlugin('style.css'),
      
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../examples/index.html'),
      }),
    ],
  })
})()
