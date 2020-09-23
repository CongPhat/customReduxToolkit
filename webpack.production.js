var webpack = require('webpack')
var path = require('path')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const TerserPlugin = require('terser-webpack-plugin')

const rootDir = path.resolve(process.cwd())
const assetsPath = path.resolve(rootDir, 'src/assets')
const srcPath = path.resolve(rootDir, 'src')
const glob = require('glob')

// CSS Splitting
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
const devServer = {
  port: 4000,
  open: true,
  disableHostCheck: true,
  historyApiFallback: true,
  overlay: true,
  stats: 'minimal',
  inline: true,
  compress: true,
  contentBase: '/',
  clientLogLevel: 'error',
}
// const VENDOR_LIBS = ["axios", "react", "react-dom", "react-redux", "react-router-dom", "redux"];
var config = {
  // entry: ['react-hot-loader/patch', path.join(__dirname, './src/shared/index.tsx')],
  entry: {
    // entry: ['react-hot-loader/patch', path.join(__dirname, './src/shared/index.tsx')],
    bundle: `${srcPath}/index.tsx`,
    // xlsx: './node_modules/xlsx/xlsx.js',
    // vendor: VENDOR_LIBS,
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[chunkhash].[chunkhash].js',
    chunkFilename: 'test.js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'babel-loader',
      },
      {
        /*bien dich soure map sang ts*/
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'source-map-loader',
        exclude: [
          // instead of /\/node_modules\//
          path.join(process.cwd(), 'node_modules'),
        ],
      },
      {
        loader: 'file-loader',
        test: /\.gz$|\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2|\.eot$|.ttf$|\.wav$|\.mp3$|\.icon$|\?[a-z0-9]+?$/,
        query: {
          name: '[name]-[md5:hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new TerserPlugin({
      parallel: true,
      terserOptions: {
        ecma: 6,
      },
    }),
    new UglifyJSPlugin({
      test: /\.tsx($|\?)/i,
      sourceMap: false,
      uglifyOptions: {
        output: {
          comments: false, // remove comments
        },
        compress: {
          unused: true,
          dead_code: true, // big one--strip code that will never execute
          // warnings: false, // good for prod apps so users can't peek behind curtain
          drop_debugger: true,
          conditionals: true,
          evaluate: true,
          drop_console: true, // strips console statements
          sequences: true,
          booleans: true,
        },
      },
    }),
  ],
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10,
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
    runtimeChunk: true,
  },
  mode: 'production', //production,development
  devtool: 'cheap-module-source-map', //cheap-module-source-map
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.css', '.scss'],
    plugins: [new TsConfigPathsPlugin(/* { tsconfig, compiler } */)],
  },
  devServer,
}
module.exports = config
