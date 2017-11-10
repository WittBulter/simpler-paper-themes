const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const promisify = require('util').promisify
const fs = require('fs')
const exists = promisify(fs.exists)

module.exports = (async() => {
  const dirName = process.env.npm_config_dir || undefined
  const exPath = path.resolve(__dirname, `../themes/${dirName}`)
  if (!await exists(exPath)) {
    console.log('\ndir is not found!\ntry run [npm run theme --dir={dir_name}]')
    return process.exit(1)
  }
  if (!await exists(`${exPath}/index.scss`)) {
    console.log(`\n${exPath} is not found`)
    return process.exit(1)
  }
  
  return {
    entry: {
      [dirName]: `${exPath}/index.scss`,
    },
  
    output: {
      filename: '[name].css',
      path: path.resolve(__dirname, '../dist'),
    },
  
    devtool: 'source-map',
  
    target: 'web',
  
    resolve: {
      extensions: ['.js', '.css', '.scss', '.sass', '.png'],
      modules: [
        path.resolve(__dirname, '../node_modules'),
      ],
    },
  
    module: {
      loaders: [
        {
          test: /\.css$/,
          exclude: /examples/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          }),
        },
        {
          test: /\.scss$/,
          exclude: /examples/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              'sass-loader',
            ],
          }),
        },
      ],
    },
  }
})()

