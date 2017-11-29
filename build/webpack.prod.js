const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = (async() => {
  const condig = await baseConfig
  return webpackMerge(condig, {
  
    devtool: 'eval',
  
    plugins: [
      new ExtractTextPlugin('[name].css'),
      
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  })
})()
