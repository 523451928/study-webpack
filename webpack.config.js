// Copyright 2016 CHEN Xianren. All rights reserved.
'use strict'
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const Html = require('html-webpack-plugin')
const Extract = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const prod = process.env.NODE_ENV === 'production'
const type = process.env.BUILD_TYPE
const compressStatus = process.env.COMPRESS_STATUS !== 'nocompress'

const extract = s => Extract.extract({
  loader: [prod ? {
    loader: 'css',    query: { minimize: compressStatus, discardComments: { removeAll: true } }
  } : 'css', s],
  fallbackLoader: 'style'
})
const abs = v => path.resolve(__dirname, v)
// const src = abs('src')
const src = abs(`src/${type}`)

function urlOptions(s) {
  return {
    loader: 'url',
    options: {
      context: __dirname,
      name: (prod ? s + '/[md5:hash:hex]' : '[path][name]') + '.[ext]',
      limit: 8192
    }
  }
}

function isFile(s) {
  try {
    return fs.statSync(s).isFile()
  } catch (e) {}
}

const config = {
  devServer: {
    compress: true,
    hot: true,
    inline: true,
    quiet: false,
    noInfo: false,
    stats: 'errors-only',
    port: type === 'desktop' ? 8080 : 8081,
    historyApiFallback: {
      rewrites: [
        {from: /^\/(login|register|forget|logout)/, to: '/auth.html'},
        {from: /^\/custom/, to: '/custom.html'},
        {from: /^\/share/, to: '/share.html'},
        {from: /^\/preshare/, to: '/preshare.html'},
        {from: /^\/coupon-share/, to:'/share-coupon.html'},
        {from: /^\/receive-coupon/, to:'/receive-coupon.html'},
        {from: /^\/artist/, to: '/list_artist.html'},
        {from: /^\/work/, to: '/detail.html'}
      ]
    }
  },
  context: src,
  entry: {},
  output: prod ? {
    path: type === 'desktop' ? abs('dist/fe-dist') : abs('dist/m-dist'),
    publicPath: '/',
    filename: 'scripts/[chunkhash].js',
    chunkFilename: 'scripts/[id].js',
    hashFunction: 'md5',
    hashDigest: 'hex',
    hashDigestLength: 32
  } : {
    publicPath: '/',
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[id].js'
  },
  resolve: {
    modules: [`src/${type}`, 'lib', `src/${type}/assets`, 'node_modules'].map(abs),
    extensions: ['.vue', '.js', '.json', '.scss', '.styl', '.css'],
    alias: {
      vue: 'vue/dist/vue',
      hammerjs: 'js/hammer',
      vueTouch: 'js/vue-touch',
      jquery: 'js/jquery'
    }
  },
  resolveLoader: { modules: ['node_modules'].map(abs) },
  module: {
    rules: [
      { enforce: 'pre', test: /\.(js|vue)$/, loader: 'eslint-loader' },
      {
        test: /\.js$/,
        include: 'lib/json/districts.js',
        loader: 'babel-loader'
      },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.pug$/, loader: 'pug-loader' },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /(\.scss$|\.sass$)/, loader: extract('sass-loader') },
      { test: /\.styl$/, loader: extract('stylus-loader') },
      {
        test: /\.css$/,
        include: ['lib', 'node_modules'],
        loader: extract('postcss-loader')
      },
      {
        test: /\.(gif|jpe?g|png)(\?|#|$)/,
        include: 'lib',
        use: urlOptions('images')
      },
      {
        test: /\.(eot|svg|ttf|woff2?)(\?|#|$)/,
        include: 'lib',
        use: urlOptions('fonts')
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'global' }),
    new Extract({
      allChunks: true,
      filename: `styles/[${prod ? 'contenthash' : 'name'}].css`
    })
  ]
}

glob.sync('scripts/app/**/!(_)*.js', { cwd: src, nodir: true }).forEach(f => {
  let j = f.indexOf('/') + 5
  let k = f.lastIndexOf('.')
  let s = f.slice(j, k)
  config.entry[s] = f
})

if (prod) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  )
  if (compressStatus) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      output: { comments: false },
      compress: { warnings: false }
    }))
  }
} else {
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
}

glob.sync('@(views|pages)/**/!(_)*.pug', { cwd: src, nodir: true }).forEach(f => {
  let i = f.indexOf('/') + 1
  let j = f.lastIndexOf('.')
  let s = f.slice(i, j)
  let options = {
    // filename: f.slice(0, i) === 'pages/' ? f.slice(0, j) + '.html' : f.slice(0, j).replace(/views/g, 'pages') + '.html',
    filename: f.slice(0, j) + '.html',
    template: path.resolve(src, f),
    inject: true,
    chunks: ['global']
  }
  if (f.slice(0, i) === 'pages/') {
    if (prod) {
      if (isFile(path.resolve(src, 'views', f.slice(i)))) return
    } else {
      options.filename = options.filename.slice(i)
    }
  }
  if (isFile(path.resolve(src, 'scripts/app/', s + '.js'))) options.chunks.push(s)
  if (prod && f.slice(0, i) === 'pages/') {
    options.minify = {
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: false,
      collapseWhitespace: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      sortAttributes: true,
      sortClassName: false
    }
  }
  config.plugins.push(new Html(options))
})

for (let r of config.module.rules) {
  let a = r.include
  if (a == null) a = []
  if (!Array.isArray(a)) a = [a]
  a.unshift(`src/${type}`)
  r.include = a.map(abs)
}

module.exports = config
