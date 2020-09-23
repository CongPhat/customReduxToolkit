const path = require('path')
const prod = process.argv[3]
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { TsConfigPathsPlugin } = require('awesome-typescript-loader')
const isDevelopment = prod === 'development'
console.log(isDevelopment)
const PurgecssPlugin = require('purgecss-webpack-plugin')

const rootDir = path.resolve(process.cwd())
const assetsPath = path.resolve(rootDir, 'src/assets')
const srcPath = path.resolve(rootDir, 'src')
const buildPath = path.resolve(rootDir, 'build')
const glob = require('glob')

const { override, addPostcssPlugins } = require('customize-cra')

module.exports = {
  mode: 'development',
  entry: {
    app: `${srcPath}/index.tsx`,
  },
  output: {
    path: buildPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        include: srcPath,
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-modules-typescript-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-modules-typescript-loader' },
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', srcPath],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    plugins: [new TsConfigPathsPlugin(/* { tsconfig, compiler } */)],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${assetsPath}/index.html`,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    // new PurgecssPlugin({
    //   paths: [
    //     `${assetsPath}/index.html`,
    //     ...glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
    //     ...glob.sync(`${path.join(__dirname, 'node_modules')}/antd/es/**/*.css`, { nodir: false }),
    //   ],
    //   extractors: [
    //     {
    //       extractor: content => content.match(/([a-zA-Z-]+)(?= {)/g) || [],
    //       extensions: ['css'],
    //     },
    //   ],
    //   only: ['bundle', 'vendor', 'module'],
    // }),
    // new CopyWebpackPlugin(
    //   [{ from: 'src/assets/images', to: 'src/assets/images' }]
    // ),
  ],
  devServer: {
    port: 6969,
    historyApiFallback: true,
    open: true,
    disableHostCheck: true,
    overlay: true,
    stats: 'minimal',
    inline: true,
    compress: true,
    contentBase: '/',
    clientLogLevel: 'error',
  },
  target: 'web',
}
