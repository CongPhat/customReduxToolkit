const { resolve } = require('path')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: resolve(__dirname, 'src/index.js'),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'simple-scrollspy.js',
    library: 'scrollSpy',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
      test: /\.js($|\?)/i,
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
}
