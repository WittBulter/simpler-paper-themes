const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const promisify = require('util').promisify
const fs = require('fs')
const exists = promisify(fs.exists)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const themes = path.resolve(__dirname, '../themes')

const findAllModules = async() => {
  let entrys = []
  const modules = await readdir(themes)
  for (let p of modules) {
    if (!(await stat(`${themes}/${p}`)).isDirectory()) continue
    entrys.push({ name: p, path: `${themes}/${p}` })
  }
  return entrys
}

const findOneModules = async(dir) => {
  const exPath = `${themes}/${dir}`
  if (!await exists(exPath)) {
    console.log('\ndir is not found!\ntry run [npm run server --dir={dir_name}]')
    return process.exit(1)
  }
  if (!await exists(`${exPath}/index.scss`)) {
    console.log(`\n${exPath} is not found`)
    return process.exit(1)
  }
  return [{ name: dir, path: `${exPath}/index.scss` }]
}

module.exports = (async() => {
  const dirName = process.env.npm_config_dir || undefined
  const entrys = dirName === 'all' ? await findAllModules() : await findOneModules(dirName)
  const entryMap = entrys.reduce((pre, next) => Object.assign(pre, { [next.name]: next.path }), {})

  return {
    entry: entryMap,
  
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
              {
                loader: 'css-loader',
                options:{ minimize: true },
              },
              'sass-loader',
            ],
            
          }),
        },
      ],
    },
  }
})()

