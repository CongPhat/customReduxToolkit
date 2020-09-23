var webpack = require("webpack");
var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // mini files all
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;


const rootDir = path.resolve(process.cwd())
const assetsPath = path.resolve(rootDir, 'src/assets')
const srcPath = path.resolve(rootDir, 'src/Common/LazyLoadComponent')

// CSS Splitting
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
const devServer = {
  port: 4000,
  open: true,
  disableHostCheck: true,
  historyApiFallback: true,
  overlay: true,
  stats: "minimal",
  inline: true,
  compress: true,
  contentBase: "/",
  clientLogLevel: "error",
};
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
    path: path.join(__dirname, "lib"),
    filename: 'LazyLoadComponent.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "babel-loader",
      },
      {
        /*bien dich soure map sang ts*/
        enforce: "pre",
        test: /\.js?$/,
        loader: "source-map-loader",
        exclude: [
          // instead of /\/node_modules\//
          path.join(process.cwd(), "node_modules"),
        ],
      },
      {
        loader: "file-loader",
        test: /\.gz$|\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2|\.eot$|.ttf$|\.wav$|\.mp3$|\.icon$|\?[a-z0-9]+?$/,
        query: {
          name: "[name]-[md5:hash:8].[ext]",
        },
      },
      {
        test: /\.module\.s(a|c)ss$/,
        loader: [
          MiniCssExtractPlugin.loader,
          { loader: "css-modules-typescript-loader"},
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          },
        ]
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        loader: [
          MiniCssExtractPlugin.loader,
          { loader: "css-modules-typescript-loader"},
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          },
        ]
      }
    ],
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new CleanWebpackPlugin(["lib"]),
    new UglifyJsPlugin({
      uglifyOptions: {
        warnings: false,
        parse: {},
        compress: {},
        mangle: true, // Note `mangle.properties` is `false` by default.
        output: null,
        toplevel: false,
        nameCache: null,
        ie8: false,
        keep_fnames: true,
      },
    }),
    // new CopyWebpackPlugin(
    //   [{ from: 'src/assets/images', to: 'src/assets/images' }]
    // ),
  ],
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: -10,
        },
      },
    },
    runtimeChunk: true,
  },
  mode: "production", //production,development
  devtool: "cheap-module-source-map", //cheap-module-source-map
  performance: {
    hints: process.env.NODE_ENV === "production" ? "warning" : false,
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", '.css', '.scss'],
    plugins: [
      new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
    ]
  },
  devServer,
};
module.exports = config;
