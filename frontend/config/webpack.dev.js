const helpers = require('./helpers');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const commonConfig = require('./webpack.common.js'); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');



/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag('hot');
const METADATA = webpackMerge(commonConfig({env: ENV}).metadata, {
  host: HOST,
  port: PORT,
  ENV: ENV,
  HMR: HMR
});


module.exports = function (options) {
  return webpackMerge(commonConfig({env: ENV}), {


    devtool: 'cheap-module-source-map',

    output: {
      path: helpers.root('dist'),
      filename: '[name].bundle.js',
      sourceMapFilename: '[file].map',
      chunkFilename: '[id].chunk.js',
      library: 'ac_[name]',
      libraryTarget: 'var',
    },

    module: {

      rules: [

        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
          include: [helpers.root('src', 'styles')]
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
          include: [helpers.root('src', 'styles')]
        },

      ]

    },

    plugins: [

      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       **/
      new DefinePlugin({
        'ENV': JSON.stringify(METADATA.ENV),
        'HMR': METADATA.HMR,
        'process.env': {
          'ENV': JSON.stringify(METADATA.ENV),
          'NODE_ENV': JSON.stringify(METADATA.ENV),
          'HMR': METADATA.HMR,
        }
      }),

      new AddAssetHtmlPlugin([
        { filepath: helpers.root('src/assets/js', 'jquery-3.1.0.min.js'), includeSourcemap: false },
        { filepath: helpers.root('src/assets/js', 'bootstrap.min.js'), includeSourcemap: false },
        { filepath: helpers.root('src/assets/js', 'arrive.min.js'), includeSourcemap: false },
        { filepath: helpers.root('src/assets/js', 'material.min.js'), includeSourcemap: false },
        { filepath: helpers.root('src/assets/js', 'bootstrap-notify.js'), includeSourcemap: false },
        { filepath: helpers.root('src/assets/js', 'material-dashboard.js'), includeSourcemap: false },
        { filepath: helpers.root('src/assets/js', 'demo.js'), includeSourcemap: false },
        { filepath: helpers.root('node_modules/reflect-metadata', 'Reflect.js'), includeSourcemap: false }
        
      ]),

      new LoaderOptionsPlugin({
        debug: true,
        options: {

        }
      }),

    ],

    // webpack dev server configurations
    devServer: {
      port: METADATA.port,
      host: METADATA.host,
      historyApiFallback: true,
      watchOptions: {
        ignored: /node_modules/
      },

      setup: function(app) {
      }
    },

    // Node configuration
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  });
}
